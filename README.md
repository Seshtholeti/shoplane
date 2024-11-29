import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, ListContactsCommand, GetContactAttributesCommand } from '@aws-sdk/client-connect';

const s3 = new S3Client();
const connect = new ConnectClient();

export const handler = async (event) => {
  const bucketName = 'customeroutbound-data';
  const fileName = 'CustomerOutboundNumber.csv';
  const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';

  try {
    // Step 1: Fetch phone numbers from CSV
    const phoneNumbers = await fetchPhoneNumbersFromCSV(bucketName, fileName);
    if (phoneNumbers.length === 0) {
      throw new Error('No phone numbers found in the CSV file.');
    }

    // Step 2: Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
    const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

    // Step 3: Check call records for yesterday
    const callDetails = await getCallDetails(startOfYesterday, endOfYesterday, instanceId, phoneNumbers);

    // Step 4: Log or return the call details
    console.log('Call Details:', callDetails);
    
    return {
      statusCode: 200,
      body: JSON.stringify(callDetails),
    };
    
  } catch (error) {
    console.error('Error processing the Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error.stack }),
    };
  }
};

const fetchPhoneNumbersFromCSV = async (bucketName, fileName) => {
  const params = { Bucket: bucketName, Key: fileName };
  const command = new GetObjectCommand(params);
  
  const response = await s3.send(command);
  const stream = response.Body;

  if (!stream) {
    throw new Error("No stream data found in the S3 object.");
  }

  const phoneNumbers = [];
  
  await new Promise((resolve, reject) => {
    stream
      .pipe(csvParser({ separator: ';' }))
      .on('data', (row) => {
        const phoneNumber = row.PhoneNumber || row['Name;PhoneNumber']?.split(';')[1]?.trim();
        if (phoneNumber) {
          let formattedNumber = phoneNumber.replace(/\D/g, '');
          if (formattedNumber.length === 10) {
            formattedNumber = `+91${formattedNumber}`;
          } else if (formattedNumber.length === 11) {
            formattedNumber = `+1${formattedNumber}`;
          }
          phoneNumbers.push(formattedNumber);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  return phoneNumbers;
};

const getCallDetails = async (startTime, endTime, instanceId, phoneNumbers) => {
  const callDetails = [];

  try {
    // Loop through each phone number and get its call details
    for (const number of phoneNumbers) {
      // Step 1: List the contacts for a given time range
      const listContactsParams = {
        InstanceId: instanceId,
        StartTime: startTime,
        EndTime: endTime,
        ContactFilter: {
          Channel: 'VOICE',
          CustomerPhoneNumber: number, // Filter by phone number
        },
      };

      const listContactsCommand = new ListContactsCommand(listContactsParams);
      const contactsData = await connect.send(listContactsCommand);

      // Step 2: Fetch detailed attributes for each contact
      for (const contact of contactsData.ContactList) {
        const contactAttributesParams = {
          InstanceId: instanceId,
          ContactId: contact.ContactId,
        };

        const getAttributesCommand = new GetContactAttributesCommand(contactAttributesParams);
        const attributesData = await connect.send(getAttributesCommand);

        // Step 3: Push the detailed call information
        callDetails.push({
          outboundNumber: number,
          contactId: contact.ContactId,
          agentId: attributesData.Attributes.AgentId,
          disposition: attributesData.Attributes.Disposition,
          timestamp: contact.StartTime,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching call details:", error);
    throw new Error("Error fetching call details from Amazon Connect.");
  }

  return callDetails;
};