import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, ListQueuesCommand, GetCurrentMetricDataCommand } from "@aws-sdk/client-connect";
// Create S3 and Connect clients
const s3Client = new S3Client({ region: 'us-east-1' });
const connectClient = new ConnectClient({ region: 'us-east-1' });
// Convert data to CSV format
function convertToCSV(data) {
 const header = "Date,QueueID,MetricName,MetricValue\n";
 const rows = data.map(row =>
   `${row.date},${row.queueId},${row.metricName},${row.metricValue}`).join('\n');
 return header + rows;
}
// Convert data to JSON format
function convertToJSON(data) {
 return JSON.stringify(data, null, 2);
}
// Upload file to S3
async function uploadToS3(fileContent, bucketName, fileName) {
 const command = new PutObjectCommand({
   Bucket: bucketName,
   Key: fileName,
   Body: fileContent,
   ContentType: fileName.endsWith('.csv') ? 'text/csv' : 'application/json',
 });
 await s3Client.send(command);
}
// Fetch all queue IDs dynamically
async function fetchQueueIds(instanceId) {
 const queueIds = [];
 try {
   const listQueuesCommand = new ListQueuesCommand({ InstanceId: instanceId });
   const response = await connectClient.send(listQueuesCommand);
   response.QueueSummaryList.forEach(queue => {
     queueIds.push(queue.Id);
   });
 } catch (err) {
   console.error("Error fetching queue IDs:", err);
 }
 return queueIds;
}
// Fetch metrics data
async function fetchMetrics(filters, groupings, metrics, dateRange, instanceId) {
 const dailyMetrics = [];
 // Fetch dynamic queue IDs
 const queueIds = await fetchQueueIds(instanceId);
 // Validate that at least one queue ID is fetched
 if (queueIds.length === 0) {
   throw new Error("No queue IDs found. Please ensure that there are active queues in the Amazon Connect instance.");
 }
 // Include at least one queue ID in filters
 filters.Queues = queueIds;
 // Iterate over the date range and fetch data
 for (const date of dateRange) {
   const input = {
     InstanceId: instanceId,
     Filters: filters,
     Groupings: groupings,
     CurrentMetrics: metrics,
     StartTime: new Date(`${date}T00:00:00Z`).toISOString(),
     EndTime: new Date(`${date}T23:59:59Z`).toISOString(),
   };
   try {
     const command = new GetCurrentMetricDataCommand(input);
     const data = await connectClient.send(command);
     // Process the fetched data
     data.MetricResults.forEach((result) => {
       result.Collections.forEach((collection) => {
         dailyMetrics.push({
           date,
           queueId: result.Dimensions.Queue?.Id || "Unknown Queue",
           queueName: result.Dimensions.Queue?.Name || "Unknown Queue",
           metricName: collection.Metric.Name,
           metricValue: collection.Value,
         });
       });
     });
   } catch (err) {
     console.error(`Error fetching metrics for date ${date}:`, err);
   }
 }
 return dailyMetrics;
}
// Main handler function
export const handler = async (event) => {
 const { resourceType, startDate, endDate, isCumulativeReport, format } = event;
 const instanceId = process.env.InstanceId;
 const bucketName = process.env.S3_BUCKET_NAME;
 if (!bucketName || !instanceId) {
   return {
     statusCode: 500,
     body: JSON.stringify({ error: "S3 bucket name or Instance ID is not set in environment variables." }),
   };
 }
 const dateRange = getDateRange(startDate, endDate);
 const filters = { Channels: ["VOICE"] };
 const groupings = ["QUEUE"];
 const metrics = [
   { Name: "AGENTS_ONLINE", Unit: "COUNT" },
   { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
   { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
   { Name: "AGENTS_ERROR", Unit: "COUNT" },
   { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
   { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
 ];
 try {
   const metricsData = await fetchMetrics(filters, groupings, metrics, dateRange, instanceId);
   let reportData;
   if (isCumulativeReport) {
     // Aggregate metrics data
     const aggregatedData = metricsData.reduce((acc, curr) => {
       const key = `${curr.metricName}`;
       if (!acc[key]) {
         acc[key] = { ...curr, metricValue: 0 };
       }
       acc[key].metricValue += curr.metricValue;
       return acc;
     }, {});
     reportData = Object.values(aggregatedData);
   } else {
     reportData = metricsData;
   }
   // Convert the report to the chosen format (CSV or JSON)
   const fileContent = format === 'csv' ? convertToCSV(reportData) : convertToJSON(reportData);
   const fileName = `${isCumulativeReport ? 'cumulative' : 'daily'}-report-${Date.now()}.${format}`;
   // Upload file to S3
   await uploadToS3(fileContent, bucketName, fileName);
   return {
     statusCode: 200,
     body: JSON.stringify({
       message: "File uploaded successfully.",
       fileUrl: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
     }),
   };
 } catch (error) {
   console.error("Error generating report:", error);
   return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
 }
};
// Utility function to get date range
function getDateRange(startDate, endDate) {
 const dates = [];
 let currentDate = new Date(startDate);
 while (currentDate <= new Date(endDate)) {
   dates.push(currentDate.toISOString().split("T")[0]);
   currentDate.setDate(currentDate.getDate() + 1);
 }
 return dates;
}
