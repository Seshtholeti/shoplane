import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, StartOutboundVoiceContactCommand } from '@aws-sdk/client-connect';

// Initialize S3 and Connect clients
const s3 = new S3Client();
const connect = new ConnectClient();

// Lambda handler function
export const handler = async (event) => {
  const bucketName = 'customeroutbound-data'; // Replace with your bucket name
  const fileName = 'CustomerOutboundNumbers.csv'; // Replace with your CSV file key
  const contactFlowId = 'YOUR-CONTACT-FLOW-ID'; // Replace with your Contact Flow ID
  const instanceId = 'YOUR-CONNECT-INSTANCE-ID'; // Replace with your Connect Instance ID
  const queueId = 'YOUR-QUEUE-ID'; // Replace with your Queue ID
  const sourcePhoneNumber = 'YOUR-SOURCE-PHONE-NUMBER'; // Replace with your Source Phone Number

  try {
    // Fetch the CSV file from S3
    const params = { Bucket: bucketName, Key: fileName };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    const stream = response.Body;

    if (!stream) {
      throw new Error("No stream data found in the S3 object.");
    }

    // Parse CSV data
    const phoneNumbers = [];
    const results = await new Promise((resolve, reject) => {
      const rows = [];
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          if (row.PhoneNumber) {
            phoneNumbers.push(row.PhoneNumber); // Assuming the CSV column is named "PhoneNumber"
          }
          rows.push(row);
        })
        .on('end', () => resolve(rows))
        .on('error', (error) => reject(error));
    });

    console.log('Phone numbers parsed:', phoneNumbers);

    // Initiate outbound calls for each phone number
    for (const destinationPhoneNumber of phoneNumbers) {
      const input = {
        DestinationPhoneNumber: destinationPhoneNumber,
        ContactFlowId: contactFlowId,
        InstanceId: instanceId,
        QueueId: queueId,
        SourcePhoneNumber: sourcePhoneNumber,
      };

      const voiceCommand = new StartOutboundVoiceContactCommand(input);
      const callResponse = await connect.send(voiceCommand);
      console.log(`Call initiated for ${destinationPhoneNumber}:`, callResponse);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Outbound calls initiated successfully' }),
    };
  } catch (error) {
    console.error('Error processing the Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error.stack }),
    };
  }
};