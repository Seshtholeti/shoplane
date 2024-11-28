import AWS from 'aws-sdk';  // From the Layer
import readline from 'readline';  // Built-in Node.js module
import { Readable } from 'stream';  // Built-in Node.js module

const s3 = new AWS.S3();
const connect = new AWS.Connect();

// Function to read CSV file from S3
async function readCsvFileFromS3(bucketName, fileName) {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    console.log('Fetching file from S3...');
    const data = await s3.getObject(params).promise();
    const fileContent = data.Body.toString('utf-8');
    console.log('CSV file fetched successfully.');

    const rl = readline.createInterface({
      input: Readable.from(fileContent),
      crlfDelay: Infinity,
    });

    const contacts = [];
    for await (const line of rl) {
      const columns = line.split(',');
      if (columns.length >= 2) {
        // Skip the header row (if necessary)
        if (columns[0].trim().toLowerCase() !== "name") {
          contacts.push({
            name: columns[0].trim(),
            phoneNumber: columns[1].trim(),
          });
        }
      }
    }
    console.log('CSV file processing completed.');
    return contacts;
  } catch (error) {
    console.error(`Error reading CSV file from S3: ${error}`);
    throw error;
  }
}

// Function to fetch contact details from Amazon Connect
async function fetchContactDetails(phoneNumber) {
  const params = {
    InstanceId: 'your-instance-id', // Replace with your Amazon Connect InstanceId
    ContactFilter: {
      Channels: ['VOICE'],
      ContactState: ['COMPLETED'],
    },
  };

  try {
    console.log(`Fetching contact details for phone number: ${phoneNumber}`);
    const data = await connect.listContacts(params).promise();
    const contact = data.Contacts.find(contact => contact.CustomerEndpoint.Address === phoneNumber);

    if (contact) {
      const contactAttributes = contact.Attributes;
      const answered = contactAttributes?.answered === 'true' ? 'Answered' : 'Not Answered';
      const agentId = contact.Agent ? contact.Agent.Id : 'N/A';

      // Print the contact details and attributes directly to the console
      console.log(`Phone Number: ${phoneNumber}`);
      console.log(`Status: ${answered}`);
      console.log('Contact Attributes:', JSON.stringify(contactAttributes, null, 2)); // Pretty-print attributes
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
  try {
    const bucketName = 'customeroutbound-data';
    const fileName = 'CustomerOutboundNumber.csv';

    console.log('Starting to read CSV file...');
    const contacts = await readCsvFileFromS3(bucketName, fileName);

    // Process each contact and fetch their details
    for (const contact of contacts) {
      console.log(`Processing record for: ${contact.name} - ${contact.phoneNumber}`);
      await fetchContactDetails(contact.phoneNumber);
    }

    // Log that the CSV processing is done
    console.log('CSV processing completed. Check the CloudWatch logs for the attributes.');

    return {
      statusCode: 200,
      body: 'Processed contact details. Check the CloudWatch logs for the attributes.',
    };
  } catch (error) {
    console.error('Error during Lambda function execution:', error);
    return {
      statusCode: 500,
      body: 'An error occurred while processing the Lambda function.',
    };
  }
};