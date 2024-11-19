// //  try {
// //    const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
// //    let reportData;
// //    if (isCumulativeReport) {
// //      reportData = aggregateMetrics(dailyMetrics);
// //    } else {
// //      reportData = dailyMetrics;
// //    }
// //    // Convert the report to the chosen format (CSV or JSON)
// //    const fileContent = format === 'csv' ? convertToCSV(reportData) : convertToJSON(reportData);
// //    const fileName = `${isCumulativeReport ? 'cumulative' : 'daily'}-report-${Date.now()}.${format}`;
// //    await uploadToS3(fileContent, bucketName, fileName);
// //    return {
// //      statusCode: 200,
// //      body: JSON.stringify({
// //        message: "File uploaded successfully.",
// //        fileUrl: `https://s3.amazonaws.com/${bucketName}/${fileName}`,
// //      }),
// //    };
// //  } catch (error) {
// //    console.error("Error generating report:", error);
// //    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
// //  }
// // };
// try {
//    const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
//    let reportData;
//    let fileContent;
//    if (isCumulativeReport) {
//      reportData = aggregateMetrics(dailyMetrics);
//      fileContent = format === 'csv' ? convertCumulativeToCSV(reportData) : convertToJSON(reportData);
//    } else {
//      reportData = dailyMetrics;
//      fileContent = format === 'csv' ? convertDailyToCSV(reportData) : convertToJSON(reportData);
//    }
//    const fileName = `${isCumulativeReport ? 'cumulative' : 'daily'}-report-${Date.now()}.${format}`;
//    await uploadToS3(fileContent, bucketName, fileName);
//    const fileUrl = `https://s3.amazonaws.com/${bucketName}/${fileName}`;
//    return {
//      statusCode: 200,
//      body: JSON.stringify({
//        message: "File uploaded successfully.",
//        fileUrl: fileUrl,
//      }),
//    };
//  } catch (error) {
//    console.error("Error generating report:", error);
//    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
//  }
// };


this is the json and csv converting code.

please update the below code.

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, GetCurrentMetricDataCommand, ListQueuesCommand } from "@aws-sdk/client-connect";
// Create an S3 client
const s3Client = new S3Client({ region: 'us-east-1' });
// The Connect client
const client = new ConnectClient({ region: 'us-east-1' });
// Function to convert daily data to CSV format with metric names as headers
function convertDailyToCSV(data, metricNames) {
 const header = ['Date', 'QueueID', ...metricNames].join(',') + '\n';
 const rows = data.map(day => {
   return day.metrics.map(queue => {
     const metricsRow = metricNames.map(name => {
       const metric = queue.metrics.find(m => m.metricName === name);
       return metric ? metric.metricValue : ''; // If metric not found, leave blank
     }).join(',');
     return `${day.date},${queue.queueId},${metricsRow}`;
   }).join('\n');
 }).join('\n');
 return header + rows;
}
// Function to convert data to JSON format
function convertToJSON(data) {
 return JSON.stringify(data, null, 2);
}
// Function to upload file to S3
async function uploadToS3(fileContent, bucketName, fileName) {
 const command = new PutObjectCommand({
   Bucket: bucketName,
   Key: fileName,
   Body: fileContent,
   ContentType: fileName.endsWith('.csv') ? 'text/csv' : 'application/json',
 });
 await s3Client.send(command);
}
// Function to get date range
function getDateRange(startDate, endDate) {
 const dates = [];
 let currentDate = new Date(startDate);
 while (currentDate <= new Date(endDate)) {
   dates.push(new Date(currentDate).toISOString().split("T")[0]);
   currentDate.setDate(currentDate.getDate() + 1);
 }
 return dates;
}
// Function to fetch all queue IDs
const fetchAllQueueIds = async () => {
 const queueIds = [];
 try {
   const listQueuesCommand = new ListQueuesCommand({
     InstanceId: process.env.InstanceId,
   });
   const data = await client.send(listQueuesCommand);
   if (data.QueueSummaryList && data.QueueSummaryList.length > 0) {
     data.QueueSummaryList.forEach(queue => {
       queueIds.push(queue.Id);
     });
   }
 } catch (err) {
   console.error("Error fetching queue IDs:", err);
 }
 return queueIds;
};
// Function to fetch metrics for all queue IDs and return them grouped by date
const fetchMetrics = async (filters, groupings, metrics, dateRange) => {
 const dailyMetrics = [];
 for (const date of dateRange) {
   const input = {
     InstanceId: process.env.InstanceId,
     Filters: filters,
     Groupings: groupings,
     CurrentMetrics: metrics,
     StartTime: new Date(`${date}T00:00:00Z`).toISOString(),
     EndTime: new Date(`${date}T23:59:59Z`).toISOString(),
   };
   try {
     const command = new GetCurrentMetricDataCommand(input);
     const data = await client.send(command);
     const metricsForDate = {
       date,
       metrics: [],
     };
     if (data.MetricResults && data.MetricResults.length > 0) {
       data.MetricResults.forEach((result) => {
         // Extract queueId and metrics for each result
         const queueId = result.Dimensions.Queue && result.Dimensions.Queue.Id ? result.Dimensions.Queue.Id : "Unknown Queue";
         const resultMetrics = result.Collections.map((collection) => ({
           metricName: collection.Metric.Name,
           metricValue: collection.Value,
         }));
         metricsForDate.metrics.push({
           queueId,
           metrics: resultMetrics,
         });
       });
     }
     dailyMetrics.push(metricsForDate);
   } catch (err) {
     console.error(`Error fetching metrics for date ${date}:`, err);
     dailyMetrics.push({
       date,
       errorMessage: err.message,
     });
   }
 }
 return dailyMetrics;
};
// Main handler function
export const handler = async (event) => {
 const { startDate, endDate, format } = event;
 const instanceId = process.env.InstanceId;
 const bucketName = process.env.S3_BUCKET_NAME;
 if (!bucketName) {
   return { statusCode: 500, body: JSON.stringify({ error: "S3 bucket name is not set in environment variables." }) };
 }
 if (!startDate || !endDate) {
   return { statusCode: 400, body: JSON.stringify({ error: "Missing required parameters in the event." }) };
 }
 const dateRange = getDateRange(startDate, endDate);
 const queueIds = await fetchAllQueueIds();
 if (queueIds.length === 0) {
   return { statusCode: 500, body: JSON.stringify({ error: "No queue IDs found." }) };
 }
 const filters = {
   Queues: queueIds,
   Channels: ["VOICE"],  // Assuming voice queue
 };
 const groupings = ["QUEUE"];
 const metrics = [
   { Name: "AGENTS_ONLINE", Unit: "COUNT" },
   { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
   { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
   { Name: "AGENTS_ERROR", Unit: "COUNT" },
   { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
   { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
   { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
   { Name: "AGENTS_NON_PRODUCTIVE", Unit: "COUNT" },
   { Name: "AGENTS_STAFFED", Unit: "COUNT" },
   { Name: "SLOTS_ACTIVE", Unit: "COUNT" },
   { Name: "SLOTS_AVAILABLE", Unit: "COUNT" },
 ];
 try {
   const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
   const metricNames = metrics.map(m => m.Name);
   let fileContent = convertDailyToCSV(dailyMetrics, metricNames);
   const fileName = `daily-report-${Date.now()}.${format}`;
   await uploadToS3(fileContent, bucketName, fileName);
   const fileUrl = `https://s3.amazonaws.com/${bucketName}/${fileName}`;
   return {
     statusCode: 200,
     body: JSON.stringify({
       message: "File uploaded successfully.",
       fileUrl: fileUrl,
     }),
   };
 } catch (error) {
   console.error("Error generating report:", error);
   return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
 }
};

the cumulative and json respnse I am not getting, csv is correct. 
