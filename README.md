import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, StartOutboundVoiceContactCommand } from '@aws-sdk/client-connect';


const s3 = new S3Client();
const connect = new ConnectClient();

// Lambda handler function
export const handler = async (event) => {
  const bucketName = 'customeroutbound-data'; 
  const fileName = 'CustomerOutboundNumber.csv'; 
  const contactFlowId = '09f2c3c7-c424-4ad2-be1f-246be15b51a4'; 
  const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21'; 
  const queueId = 'f8c742b9-b5ef-4948-8bbf-9a33c892023f'; 
   

  try {
    
    const params = { Bucket: bucketName, Key: fileName };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    const stream = response.Body;

    if (!stream) {
      throw new Error("No stream data found in the S3 object.");
    }

    
    const phoneNumbers = [];
    const results = await new Promise((resolve, reject) => {
      const rows = [];
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          if (row.PhoneNumber) {
            phoneNumbers.push(row.PhoneNumber); 
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
        QueueId: queueId
        
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
