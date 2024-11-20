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
