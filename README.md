import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, GetCurrentMetricDataCommand, ListQueuesCommand } from "@aws-sdk/client-connect";
// Create an S3 client
const s3Client = new S3Client({ region: 'us-east-1' });
// The Connect client
const client = new ConnectClient({ region: 'us-east-1' });
// Function to convert cumulative data to CSV format with dynamic headers
function convertCumulativeToCSV(data, metricNames) {
 const header = ['Metric Name', ...metricNames].join(',') + '\n';
 const rows = metricNames.map((metricName) => {
   const row = [metricName, ...data[metricName]].join(',');
   return row;
 }).join('\n');
 return header + rows;
}
// Function to convert daily data to CSV format with metric names as headers
function convertDailyToCSV(data, metricNames) {
 const header = ['Date', 'QueueID', 'AgentID', ...metricNames].join(',') + '\n';
 const rows = data.flatMap(day =>
   day.metrics.flatMap(queue =>
     queue.metrics.map(
       metric =>
         `${day.date},${queue.queueId},${queue.agentId},${metricNames.map(name => {
           return metric.name === name ? metric.value : '';
         }).join(',')}`
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
// Function to aggregate metrics for cumulative data
function aggregateMetrics(dailyMetrics, metricNames) {
 const aggregated = {};
 metricNames.forEach((metricName) => {
   aggregated[metricName] = [];
 });
 // Aggregate the data by summing up the values for each metric
 dailyMetrics.forEach((day) => {
   day.metrics.forEach((queue) => {
     queue.metrics.forEach(({ metricName, metricValue }) => {
       if (metricNames.includes(metricName)) {
         aggregated[metricName].push(metricValue);
       }
     });
   });
 });
 return aggregated;
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
         // Safely access agent and queue ID
         const agentId = result.Dimensions.Agent && result.Dimensions.Agent.Id ? result.Dimensions.Agent.Id : "Unknown Agent";
         const queueId = result.Dimensions.Queue && result.Dimensions.Queue.Id ? result.Dimensions.Queue.Id : "Unknown Queue";
         metricsForDate.metrics.push({
           queueId: queueId,
           queueName: result.Dimensions.Queue && result.Dimensions.Queue.Name ? result.Dimensions.Queue.Name : "Unknown Queue",
           agentId: agentId,
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
   { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
   { Name: "AGENTS_NON_PRODUCTIVE", Unit: "COUNT" },
   { Name: "AGENTS_ON_CONTACT", Unit: "COUNT" },
   { Name: "AGENTS_STAFFED", Unit: "COUNT" },
   { Name: "SLOTS_ACTIVE", Unit: "COUNT" },
   { Name: "SLOTS_AVAILABLE", Unit: "COUNT" },
 ];
 const metricNames = metrics.map(m => m.Name);
 try {
   const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
   let reportData;
   let fileContent;
   if (isCumulativeReport) {
     // Aggregate metrics for cumulative data
     reportData = aggregateMetrics(dailyMetrics, metricNames);
     // Prepare cumulative CSV
     fileContent = format === 'csv' ? convertCumulativeToCSV(reportData, metricNames) : convertToJSON(reportData);
   } else {
     // Prepare daily data CSV
     reportData = dailyMetrics;
     fileContent = format === 'csv' ? convertDailyToCSV(reportData, metricNames) : convertToJSON(reportData);
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

Date	QueueID	AgentID	AGENTS_ONLINE	AGENTS_AVAILABLE	CONTACTS_IN_QUEUE	AGENTS_ERROR	CONTACTS_SCHEDULED	OLDEST_CONTACT_AGE
2024-10-08	e212c573-84cb-44d6-a538-68f77f5d0183	Unknown	Agent					
2024-10-08	e212c573-84cb-44d6-a538-68f77f5d0183	Unknown	Agent					
2024-10-08	e212c573-84cb-44d6-a538-68f77f5d0183	Unknown	Agent					
2024-10-08	e212c573-84cb-44d6-a538-68f77f5d0183	Unknown	Agent					
2024-10-08	e212c573-84cb-44d6-a538-68f77f5d0183	Unknown	Agent					
2024-10-08	e212c573-84cb-44d6-a538-68f77f5d0183	Unknown	Agent					
2024-10-08	9783145b-f6e4-4d42-9414-eb8943c0d9aa	Unknown	Agent					
2024-10-08	9783145b-f6e4-4d42-9414-eb8943c0d9aa	Unknown	Agent					
![Uploading image.png…]()
