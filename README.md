import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, SearchContactsCommand } from "@aws-sdk/client-connect";
import * as csv from "csv-parser"; // Import csv-parser for parsing the CSV file
import { Readable } from "stream"; // Import Readable from stream module to work with S3 objects

const connect = new ConnectClient({
  region: "us-east-1", // Replace with your region
});

const s3 = new S3Client({
  region: "us-east-1", // Replace with your region
});

async function getPhoneNumbersFromCSV(bucketName, csvFileName) {
  const phoneNumbers = [];
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: csvFileName,
  });

  const data = await s3.send(command);
  const stream = data.Body;

  return new Promise((resolve, reject) => {
    const readableStream = stream instanceof Readable ? stream : Readable.from(stream);
    readableStream
      .pipe(csv())
      .on("data", (row) => {
        // Assuming CSV has 'PhoneNumber' field
        if (row.PhoneNumber) {
          phoneNumbers.push(row.PhoneNumber.trim()); // Ensure no extra spaces
        }
      })
      .on("end", () => {
        resolve(phoneNumbers);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function fetchOutboundContactRecords(instanceId, startDate, endDate, phoneNumbers) {
  const params = {
    InstanceId: instanceId,
    TimeRange: {
      Type: "INITIATION_TIMESTAMP", // Filtering by initiation timestamp
      StartTime: new Date(startDate),
      EndTime: new Date(endDate),
    },
    SearchCriteria: {
      InitiationMethods: ["OUTBOUND"], // Only fetch outbound calls
    },
    MaxResults: 100, // Adjust the number of results as needed
    Sort: {
      FieldName: "INITIATION_TIMESTAMP",
      Order: "DESCENDING", // Sort by most recent first
    },
  };

  const command = new SearchContactsCommand(params);
  const response = await connect.send(command);

  // Debug: Log the raw response to check the data structure
  console.log("Raw Response: ", response);

  // Debug: Log the phone numbers fetched from the CSV
  console.log("Phone Numbers from CSV: ", phoneNumbers);

  // Filter records based on phone numbers from the CSV
  const filteredRecords = response.Contacts.filter((record) => {
    const contactPhoneNumber = record.CustomerInfo?.PhoneNumber; // Adjust this based on your data
    console.log("Checking contact phone number: ", contactPhoneNumber); // Debugging log
    return phoneNumbers.includes(contactPhoneNumber);
  });

  // Debug: Log the filtered records
  console.log("Filtered Contact Records: ", filteredRecords);

  // Extract contact attributes, agent details, and answered status
  const contactDetails = filteredRecords.map((record) => ({
    ContactId: record.ContactId,
    PhoneNumber: record.CustomerInfo?.PhoneNumber,
    InitiationMethod: record.InitiationMethod,
    Channel: record.Channel,
    AgentId: record.AgentInfo?.Id || "Not Assigned",
    AgentName: record.AgentInfo?.Name || "Not Available",
    CallAnswered: record.DisconnectTimestamp ? true : false, // Assuming call answered if disconnected
    InitiationTimestamp: record.InitiationTimestamp,
    DisconnectTimestamp: record.DisconnectTimestamp,
  }));

  return contactDetails;
}

// Lambda function handler using ES modules syntax
export const handler = async (event) => {
  try {
    const bucketName = "customeroutbound-data"; // Your S3 bucket name
    const csvFileName = "CustomerOutboundNumber.csv"; // CSV file name
    const instanceId = "bd16d991-11c8-4d1e-9900-edd5ed4a9b21"; // Your Connect instance ID
    const startDate = new Date(); // Set your start date for the search
    startDate.setDate(startDate.getDate() - 1); // Start from yesterday
    const endDate = new Date(); // Set your end date for the search
    endDate.setDate(endDate.getDate() - 1); // End on yesterday

    // Step 1: Get phone numbers from CSV
    const phoneNumbers = await getPhoneNumbersFromCSV(bucketName, csvFileName);
    console.log("Fetched Phone Numbers from CSV: ", phoneNumbers);

    // Step 2: Fetch outbound contact records from Amazon Connect
    const contactDetails = await fetchOutboundContactRecords(instanceId, startDate, endDate, phoneNumbers);
    console.log("Fetched Contact Details: ", contactDetails);

    // Return the contact details as the response
    return {
      statusCode: 200,
      body: JSON.stringify(contactDetails),
    };
  } catch (error) {
    console.error("Error occurred: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};