
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, SearchContactRecordsCommand } from "@aws-sdk/client-connect";
import csv from "csv-parser";
import moment from "moment";

const s3 = new S3Client({ region: "us-east-1" });
const connect = new ConnectClient({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const bucketName = "customeroutbound-data";
    const fileName = "CustomerOutboundNumber.csv";
    const instanceId = "bd16d991-11c8-4d1e-9900-edd5ed4a9b21";

    // Fetch phone numbers from the S3 file
    const phoneNumbers = await getPhoneNumbersFromCsv(bucketName, fileName);

    // Get yesterday's date in ISO format
    const startDate = moment().subtract(1, "days").startOf("day").toISOString();
    const endDate = moment().subtract(1, "days").endOf("day").toISOString();

    // Fetch outbound contact records
    const contactRecords = await fetchOutboundContactRecords(instanceId, startDate, endDate, phoneNumbers);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Fetched outbound call records successfully",
        data: contactRecords,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching outbound call records",
        error: error.message,
      }),
    };
  }
};

// Function to fetch phone numbers from a CSV file in S3
async function getPhoneNumbersFromCsv(bucketName, fileName) {
  const params = { Bucket: bucketName, Key: fileName };
  const phoneNumbers = [];

  const stream = await s3.send(new GetObjectCommand(params));
  return new Promise((resolve, reject) => {
    stream.Body.pipe(csv())
      .on("data", (row) => {
        if (row.PhoneNumber) phoneNumbers.push(row.PhoneNumber.trim());
      })
      .on("end", () => resolve(phoneNumbers))
      .on("error", (error) => reject(error));
  });
}

// Function to fetch outbound contact records from Amazon Connect
async function fetchOutboundContactRecords(instanceId, startDate, endDate, phoneNumbers) {
  const params = {
    InstanceId: instanceId,
    StartTime: new Date(startDate),
    EndTime: new Date(endDate),
    Filters: {
      ContactType: ["OUTBOUND"],
    },
  };

  const command = new SearchContactRecordsCommand(params);
  const results = await connect.send(command);

  // Filter records based on phone numbers
  const filteredRecords = results.ContactRecords.filter((record) =>
    phoneNumbers.includes(record.CustomerEndpoint?.Address)
  );

  // Extract contact attributes, agent details, and answered status
  const contactDetails = filteredRecords.map((record) => ({
    ContactId: record.ContactId,
    Attributes: record.Attributes,
    PhoneNumber: record.CustomerEndpoint ? record.CustomerEndpoint.Address : null,
    CallAnswered: record.AgentConnectionState === "CONNECTED" ? true : false,
    AgentId: record.AgentInfo ? record.AgentInfo.Id : "Not Assigned",
    AgentName: record.AgentInfo ? record.AgentInfo.Name : "Not Available",
  }));

  return contactDetails;
}