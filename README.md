

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, GetCurrentMetricDataCommand, ListQueuesCommand } from "@aws-sdk/client-connect";
// Create an S3 client
const s3Client = new S3Client({ region: 'us-east-1' });
// The Connect client
const client = new ConnectClient({ region: 'us-east-1' });
// // Function to convert data to CSV format
// function convertToCSV(data) {
//  const header = Object.keys(data[0]).join(',') + '\n';
//  const rows = data.map(row => Object.values(row).join(',')).join('\n');
//  return header + rows;
// }

// Function to convert cumulative data to CSV format
function convertCumulativeToCSV(data) {
 const header = ['Metric Name', 'Metric Value'].join(',') + '\n';
 const rows = data.map(row => `${row.metricName},${row.metricValue}`).join('\n');
 return header + rows;
}
// Function to convert daily data to CSV format
function convertDailyToCSV(data) {
 const header = ['Date','QueueID','MetricName','MetricValue'].join(',') + '\n';
 const rows = data.flatMap(day =>
   day.metrics.flatMap(queue =>
     queue.metrics.map(
       metric =>
         `${day.date},${queue.queueId},${metric.metricName},${metric.metricValue}`
     )
   )
 ).join('\n');
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
// Function to aggregate metrics
function aggregateMetrics(dailyMetrics) {
 const aggregated = {};
 dailyMetrics.forEach((day) => {
   day.metrics.forEach((metric) => {
     metric.metrics.forEach(({ metricName, metricValue }) => {
       if (!aggregated[metricName]) {
         aggregated[metricName] = 0;
       }
       aggregated[metricName] += metricValue;
     });
   });
 });
 return Object.entries(aggregated).map(([metricName, metricValue]) => ({
   metricName,
   metricValue,
 }));
}
// Function to list all queue IDs
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
// Function to fetch metrics for all queue IDs
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
         const resultMetrics = result.Collections.map((collection) => ({
           metricName: collection.Metric.Name,
           metricValue: collection.Value,
         }));
         metricsForDate.metrics.push({
           queueId: result.Dimensions.Queue.Id || "Unknown Queue",
           queueName: result.Dimensions.Queue.Name || "Unknown Queue",
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
 const { resourceType, startDate, endDate, isCumulativeReport, format } = event;
 const instanceId = process.env.InstanceId;
 const bucketName = process.env.S3_BUCKET_NAME;
 if (!bucketName) {
   return { statusCode: 500, body: JSON.stringify({ error: "S3 bucket name is not set in environment variables." }) };
 }
 if (!resourceType || !startDate || !endDate) {
   return { statusCode: 400, body: JSON.stringify({ error: "Missing required parameters in the event." }) };
 }
 const dateRange = getDateRange(startDate, endDate);
 // Fetch all queue IDs
 const queueIds = await fetchAllQueueIds();
 if (queueIds.length === 0) {
   return { statusCode: 500, body: JSON.stringify({ error: "No queue IDs found." }) };
 }
 const filters = {
   Queues: queueIds,
   Channels: ["VOICE"],
 };
 // Grouping by queue, fetching agent and queue metrics
 const groupings = ["QUEUE"];
 const metrics = [
   { Name: "AGENTS_ONLINE", Unit: "COUNT" },
   { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
   { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
   { Name: "AGENTS_ERROR", Unit: "COUNT" },
   { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
   { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
 ];
//  try {
//    const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
//    let reportData;
//    if (isCumulativeReport) {
//      reportData = aggregateMetrics(dailyMetrics);
//    } else {
//      reportData = dailyMetrics;
//    }
//    // Convert the report to the chosen format (CSV or JSON)
//    const fileContent = format === 'csv' ? convertToCSV(reportData) : convertToJSON(reportData);
//    const fileName = `${isCumulativeReport ? 'cumulative' : 'daily'}-report-${Date.now()}.${format}`;
//    await uploadToS3(fileContent, bucketName, fileName);
//    return {
//      statusCode: 200,
//      body: JSON.stringify({
//        message: "File uploaded successfully.",
//        fileUrl: `https://s3.amazonaws.com/${bucketName}/${fileName}`,
//      }),
//    };
//  } catch (error) {
//    console.error("Error generating report:", error);
//    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
//  }
// };
try {
   const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
   let reportData;
   let fileContent;
   if (isCumulativeReport) {
     reportData = aggregateMetrics(dailyMetrics);
     fileContent = format === 'csv' ? convertCumulativeToCSV(reportData) : convertToJSON(reportData);
   } else {
     reportData = dailyMetrics;
     fileContent = format === 'csv' ? convertDailyToCSV(reportData) : convertToJSON(reportData);
   }
   const fileName = `${isCumulativeReport ? 'cumulative' : 'daily'}-report-${Date.now()}.${format}`;
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
