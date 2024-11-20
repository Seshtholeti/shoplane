import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
const s3 = new S3Client();
export const handler = async (event) => {
   const bucketName = 'customeroutbound-data'; 
   const fileName = 'CustomerOutboundNumbers.csv';
 try {
   const params = { Bucket: bucketName, Key: fileName };
   const command = new GetObjectCommand(params);
   const response = await s3.send(command);
   
   const stream = response.Body;
   if (!stream) {
     throw new Error("No stream data found in the S3 object.");
   }
   
   const results = [];
   stream
     .pipe(csvParser())
     .on('data', (row) => {
       results.push(row);
     })
     .on('end', () => {
       console.log('CSV file processed successfully:', results);
     })
     .on('error', (err) => {
       console.error('Error parsing CSV:', err);
       throw new Error('Failed to process the CSV file');
     });
   
   return new Promise((resolve, reject) => {
     stream
       .on('end', () => {
         resolve({
           statusCode: 200,
           body: JSON.stringify(results),
         });
       })
       .on('error', (err) => {
         reject({
           statusCode: 500,
           body: JSON.stringify({ error: err.message }),
         });
       });
   });
 } catch (error) {
   console.error('Error processing S3 file:', error);
   return {
     statusCode: 500,
     body: JSON.stringify({ error: error.message, details: error.stack }),
   };
 }
};



use this api below in the destination phone number you can use the the result array an in that we have the ohone numbers.


import { ConnectClient, StartOutboundVoiceContactCommand } from "@aws-sdk/client-connect"; // ES Modules import
// const { ConnectClient, StartOutboundVoiceContactCommand } = require("@aws-sdk/client-connect"); // CommonJS import
const client = new ConnectClient(config);
const input = { // StartOutboundVoiceContactRequest
  Name: "STRING_VALUE",
  Description: "STRING_VALUE",
  References: { // ContactReferences
    "<keys>": { // Reference
      Value: "STRING_VALUE", // required
      Type: "URL" || "ATTACHMENT" || "NUMBER" || "STRING" || "DATE" || "EMAIL", // required
    },
  },
  RelatedContactId: "STRING_VALUE",
  DestinationPhoneNumber: "STRING_VALUE", // required
  ContactFlowId: "STRING_VALUE", // required
  InstanceId: "STRING_VALUE", // required
  ClientToken: "STRING_VALUE",
  SourcePhoneNumber: "STRING_VALUE",
  QueueId: "STRING_VALUE",
  Attributes: { // Attributes
    "<keys>": "STRING_VALUE",
  },
  AnswerMachineDetectionConfig: { // AnswerMachineDetectionConfig
    EnableAnswerMachineDetection: true || false,
    AwaitAnswerMachinePrompt: true || false,
  },
  CampaignId: "STRING_VALUE",
  TrafficType: "GENERAL" || "CAMPAIGN",
};
const command = new StartOutboundVoiceContactCommand(input);
const response = await client.send(command);
// { // StartOutboundVoiceContactResponse
//   ContactId: "STRING_VALUE",
// };

for inputs pls refer the below code

contactId: '09f2c3c7-c424-4ad2-be1f-246be15b51a4'

response = client.start_outbound_voice_contact(
        DestinationPhoneNumber=destination_phone_number,
        ContactFlowId=contact_flow_id,
        InstanceId='bd16d991-11c8-4d1e-9900-edd5ed4a9b21',
        QueueId='f8c742b9-b5ef-4948-8bbf-9a33c892023f',
        # AnswerMachineDetectionConfig={
        #     'EnableAnswerMachineDetection': False,
        #     'AwaitAnswerMachinePrompt': False
        # }

