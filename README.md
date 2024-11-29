import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, SearchContactsCommand, GetContactAttributesCommand } from '@aws-sdk/client-connect';
import { DateTime } from 'luxon'; // To easily handle date and time manipulations

const s3 = new S3Client();
const connect = new ConnectClient();

const bucketName = 'customeroutbound-data';
const fileName = 'CustomerOutboundNumber.csv';
const contactFlowId = '09f2c3c7-c424-4ad2-be1f-246be15b51a4';
const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';

export const handler = async (event) => {
  try {
    // Step 1: Fetch and parse customer phone numbers from S3 CSV file
    const phoneNumbers = await fetchPhoneNumbersFromS3();

    // Step 2: Get yesterday's date and filter the outbound calls
    const yesterdayDate = DateTime.now().minus({ days: 1 }).toFormat('yyyy-MM-dd');
    const contacts = await getOutboundCallDetails(yesterdayDate);

    // Step 3: Check if any phone number has received an outbound call
    const callDetails = phoneNumbers.map((phoneNumber) => {
      const contact = contacts.find(contact => contact.destinationPhoneNumber === phoneNumber);
      if (contact) {
        return {
          phoneNumber,
          agentId: contact.agentId,
          callAnswered: contact.callAnswered
        };
      }
      return { phoneNumber, agentId: null, callAnswered: false };
    });

    // Step 4: Log the results
    console.log('Outbound Call Details:', callDetails);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Call check completed successfully', data: callDetails }),
    };
  } catch (error) {
    console.error('Error processing the Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error.stack }),
    };
  }
};

// Fetch phone numbers from the CSV file in S3
const fetchPhoneNumbersFromS3 = async () => {
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
          // Format phone number to E.164 format
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

  if (phoneNumbers.length === 0) {
    throw new Error('No phone numbers found in the CSV file.');
  }
  return phoneNumbers;
};

// Fetch outbound call details from Amazon Connect for yesterday
const getOutboundCallDetails = async (yesterdayDate) => {
  const params = {
    InstanceId: instanceId,
    ContactType: 'VOICE', // Make sure you filter for outbound calls of type "VOICE"
    MaxResults: 1000, // Adjust as needed
    StartTime: `${yesterdayDate}T00:00:00.000Z`, // Start of yesterday
    EndTime: `${yesterdayDate}T23:59:59.999Z`, // End of yesterday
  };
  const contacts = [];
  try {
    // Use SearchContactsCommand to search for contacts
    let nextToken;
    do {
      const searchCommand = new SearchContactsCommand({ ...params, NextToken: nextToken });
      const response = await connect.send(searchCommand);
      nextToken = response.NextToken;
      const contactIds = response.ContactSummaryList.map(contact => contact.ContactId);
      
      // Fetch detailed contact attributes for each contact ID
      for (let contactId of contactIds) {
        const attributesCommand = new GetContactAttributesCommand({
          InstanceId: instanceId,
          ContactId: contactId,
        });
        const attributesResponse = await connect.send(attributesCommand);
        contacts.push({
          contactId,
          destinationPhoneNumber: attributesResponse.Attributes.DestinationPhoneNumber,
          agentId: attributesResponse.Attributes.AgentId,
          callAnswered: attributesResponse.Attributes.CallAnswered === 'true',
        });
      }
    } while (nextToken);

    return contacts;
  } catch (error) {
    console.error('Error fetching outbound call details:', error);
    throw new Error('Failed to fetch outbound call details.');
  }
};