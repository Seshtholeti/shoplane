START RequestId: 078d30f4-b9b6-4dfc-85b6-e3fab09f1535 Version: $LATEST
2024-11-22T03:28:13.244Z	078d30f4-b9b6-4dfc-85b6-e3fab09f1535	INFO	Phone numbers parsed and formatted: [ '+919949921498', '+918639694701' ]
2024-11-22T03:28:13.624Z	078d30f4-b9b6-4dfc-85b6-e3fab09f1535	INFO	Metrics Data: {"$metadata":{"httpStatusCode":200,"requestId":"0d021aed-aaba-4b1b-9bc7-587689d9e235","attempts":1,"totalRetryDelay":0},"MetricResults":[{"Collections":[{"Metric":{"Name":"CONTACTS_HANDLED"},"Value":10},{"Metric":{"Name":"CONTACTS_ABANDONED"},"Value":6}],"Dimensions":{"QUEUE":"f8c742b9-b5ef-4948-8bbf-9a33c892023f","QUEUE_ARN":"arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/queue/f8c742b9-b5ef-4948-8bbf-9a33c892023f"},"MetricInterval":{"EndTime":"2024-11-21T23:59:59.000Z","Interval":"DAY","StartTime":"2024-11-21T00:00:00.000Z"}}]}
2024-11-22T03:28:13.624Z	078d30f4-b9b6-4dfc-85b6-e3fab09f1535	INFO	Handled Contacts: []
2024-11-22T03:28:13.662Z	078d30f4-b9b6-4dfc-85b6-e3fab09f1535	INFO	Handled Contact Agent Details: []
2024-11-22T03:28:13.662Z	078d30f4-b9b6-4dfc-85b6-e3fab09f1535	INFO	Abandoned Contacts: []
2024-11-22T03:28:13.662Z	078d30f4-b9b6-4dfc-85b6-e3fab09f1535	INFO	Abandoned Contact Agent Details: []
END RequestId: 078d30f4-b9b6-4dfc-85b6-e3fab09f1535


also for which queue and also agent id is not coming

the resuts are not coming, it gives me empty array


filter by agent and group by agent.
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, GetMetricDataV2Command } from '@aws-sdk/client-connect';
import { subDays, format } from 'date-fns';
const s3 = new S3Client();
const connect = new ConnectClient({
 region: 'us-east-1', // Ensure correct region is set
});
export const handler = async () => {
 const bucketName = 'customeroutbound-data';
 const fileName = 'CustomerOutboundNumber.csv';
 const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';
 const queueId = 'f8c742b9-b5ef-4948-8bbf-9a33c892023f'; 
 // Calculate yesterday dynamically
 const yesterdayStart = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T00:00:00Z`;
 const yesterdayEnd = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T23:59:59Z`;
 try {
   // Fetch phone numbers from the CSV in S3
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
   console.log('Phone numbers parsed and formatted:', phoneNumbers);
   // Metrics data from Amazon Connect (for yesterday's calls)
   
   const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';
   const metricDataInput = {
     ResourceArn: `arn:aws:connect:us-east-1:768637739934:instance/${instanceId}`,
     StartTime: new Date(yesterdayStart),
     EndTime: new Date(yesterdayEnd),
     Interval: { TimeZone: 'UTC', IntervalPeriod: 'DAY' },
     Filters: [
       { FilterKey: 'QUEUE', FilterValues: [queueId] },
     ],
     Groupings: ['QUEUE'],
     Metrics: [
       { Name: 'CONTACTS_HANDLED' },
       { Name: 'CONTACTS_ABANDONED' },
     ],
   };
   const metricCommand = new GetMetricDataV2Command(metricDataInput);
   const metricResponse = await connect.send(metricCommand);
   console.log('Metrics Data:', JSON.stringify(metricResponse));
   const handledContacts = [];
   const abandonedContacts = [];
   const agentDetails = { handled: [], abandoned: [] };
   for (const phoneNumber of phoneNumbers) {
     const handledMetric = metricResponse.MetricResults?.find(
       (result) => result.Dimensions.PhoneNumber === phoneNumber && result.Metric.Name === 'CONTACTS_HANDLED'
     );
     const abandonedMetric = metricResponse.MetricResults?.find(
       (result) => result.Dimensions.PhoneNumber === phoneNumber && result.Metric.Name === 'CONTACTS_ABANDONED'
     );
     if (handledMetric) {
       handledContacts.push(phoneNumber);
       const agentId = handledMetric.Dimensions.AgentId || 'N/A';
       agentDetails.handled.push({ phoneNumber, agentId });
     } else if (abandonedMetric) {
       abandonedContacts.push(phoneNumber);
       const agentId = abandonedMetric.Dimensions.AgentId || 'N/A';
       agentDetails.abandoned.push({ phoneNumber, agentId });
     }
   }
   // Results (handled vs abandoned contacts and agent IDs)
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


