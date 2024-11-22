contact id of the yesterday particular call, contact attributes of that contact id, agent id, timestamp, outbound phonenumber

i need this for the below lambda.

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, GetMetricDataV2Command } from '@aws-sdk/client-connect';
import { subDays, format } from 'date-fns';
const s3 = new S3Client();
const connect = new ConnectClient();
export const handler = async () => {
 const bucketName = 'customeroutbound-data';
 const fileName = 'CustomerOutboundNumber.csv';
 const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';
 const queueId = 'f8c742b9-b5ef-4948-8bbf-9a33c892023f';
 const yesterdayStart = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T00:00:00Z`;
 const yesterdayEnd = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T23:59:59Z`;
 try {
   const params = { Bucket: bucketName, Key: fileName };
   const command = new GetObjectCommand(params);
   const response = await s3.send(command);
   const stream = response.Body;
   if (!stream) {
     throw new Error('No stream data found in the S3 object.');
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
   if (phoneNumbers.length === 0) {
     throw new Error('No phone numbers found in the CSV file.');
   }
   const metricDataInput = {
     ResourceArn: 'arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21',
     StartTime: new Date(yesterdayStart),
     EndTime: new Date(yesterdayEnd),
     Interval: { TimeZone: 'UTC', IntervalPeriod: 'DAY' },
     Filters: [{ FilterKey: 'QUEUE', FilterValues: [queueId] }],
     Groupings: ['AGENT'],
     Metrics: [{ Name: 'CONTACTS_HANDLED' }, { Name: 'CONTACTS_ABANDONED' }],
   };
   const metricCommand = new GetMetricDataV2Command(metricDataInput);
   const metricResponse = await connect.send(metricCommand);
   const handledContacts = [];
   const abandonedContacts = [];
   const agentDetails = { handled: [], abandoned: [] };
   // MetricResults and Collections
   for (let i = 0; i < metricResponse.MetricResults.length; i++) {
     console.log('dataMetricResults', i, metricResponse.MetricResults[i]);
     for (let j = 0; j < metricResponse.MetricResults[i].Collections.length; j++) {
       const collection = metricResponse.MetricResults[i].Collections[j];
       console.log(collection.Metric.Name, 'res12', collection.Value);
       const agentId = metricResponse.MetricResults[i].Dimensions?.AGENT || 'N/A';
       const phoneNumber = metricResponse.MetricResults[i].Dimensions?.PhoneNumber || 'N/A';
       // Handle the collection and assign values to contacts and agent details
       if (collection.Metric.Name === 'CONTACTS_HANDLED' && collection.Value > 0) {
         handledContacts.push({
           phoneNumber: phoneNumber,
           contactsHandled: collection.Value,
         });
         agentDetails.handled.push({ agentId, contactsHandled: collection.Value });
       } else if (collection.Metric.Name === 'CONTACTS_ABANDONED' && collection.Value > 0) {
         abandonedContacts.push({
           phoneNumber: phoneNumber,
           contactsAbandoned: collection.Value,
         });
         agentDetails.abandoned.push({ agentId, contactsAbandoned: collection.Value });
       }
     }
   }
   console.log('Handled Contacts:', handledContacts);
   console.log('Handled Contact Agent Details:', agentDetails.handled);
   console.log('Abandoned Contacts:', abandonedContacts);
   console.log('Abandoned Contact Agent Details:', agentDetails.abandoned);
   return {
     statusCode: 200,
     body: JSON.stringify({
       message: 'Outbound call results printed successfully.',
       handledContacts,
       abandonedContacts,
       agentDetails,
     }),
   };
 } catch (error) {
   console.error('Error processing the Lambda function:', error);
   return {
     statusCode: 500,
     body: JSON.stringify({ error: error.message, details: error.stack }),
   };
 }
};
