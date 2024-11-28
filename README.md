import AWS from 'aws-sdk';
import readline from 'readline';
import { Readable } from 'stream';

const s3 = new AWS.S3();
const connect = new AWS.Connect();

// Helper function to read the CSV file from S3 and extract phone numbers
async function readCsvFileFromS3(bucketName, fileName) {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const data = await s3.getObject(params).promise();
    const fileContent = data.Body.toString('utf-8');
    
    const rl = readline.createInterface({
      input: Readable.from(fileContent),
      crlfDelay: Infinity,  // Handles both LF and CRLF line breaks
    });

    const contacts = [];
    for await (const line of rl) {
      const columns = line.split(','); // Split by comma for CSV columns
      if (columns.length >= 2) {
        const contact = {
          name: columns[0].trim(),
          phoneNumber: columns[1].trim(),
        };
        contacts.push(contact);
      }
    }
    return contacts;
  } catch (error) {
    console.error(`Error reading CSV file from S3: ${error}`);
    throw error;
  }
}

// Helper function to fetch Amazon Connect contact details based on phone number
async function fetchContactDetails(phoneNumber) {
  const params = {
    InstanceId: 'your-instance-id', // Replace with your Amazon Connect InstanceId
    ContactFilter: {
      Channels: ['VOICE'],
      ContactState: ['COMPLETED'],
    },
  };

  try {
    const data = await connect.listContacts(params).promise();
    const contact = data.Contacts.find(contact => contact.CustomerEndpoint.Address === phoneNumber);

    if (contact) {
      // Fetch the contact attributes and check if the call was answered
      const contactAttributes = contact.Attributes;
      const answered = contactAttributes?.answered === 'true' ? 'Answered' : 'Not Answered';
      const agentId = contact.Agent ? contact.Agent.Id : 'N/A'; // Get the agent ID if available

      console.log(`Phone Number: ${phoneNumber}, Status: ${answered}`);
      console.log('Contact Attributes:', contactAttributes);
      console.log('Agent ID:', agentId);
    } else {
      console.log(`No record found for phone number: ${phoneNumber}`);
    }
  } catch (error) {
    console.error(`Error fetching contact details for ${phoneNumber}:`, error);
  }
}

// Lambda function handler
export const handler = async (event) => {
  const bucketName = 'customeroutbound-data';
  const fileName = 'CustomerOutboundNumber.csv';

  // Read contacts from the CSV file stored in S3
  const contacts = await readCsvFileFromS3(bucketName, fileName);

  // Fetch and process the call records for each phone number
  for (const contact of contacts) {
    console.log(`Processing record for: ${contact.name} - ${contact.phoneNumber}`);
    await fetchContactDetails(contact.phoneNumber);
  }

  return { statusCode: 200, body: 'CSV processing completed.' };
};