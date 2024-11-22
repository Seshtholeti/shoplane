import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, GetMetricDataV2Command, ListQueuesCommand } from "@aws-sdk/client-connect";
// Create an S3 client
const s3Client = new S3Client({ region: 'us-east-1' });
// The Connect client
const client = new ConnectClient({ region: 'us-east-1' });
// Function to convert daily data to CSV format with metric names as headers
function convertDailyToCSV(data, metricNames) {
 const header = ['Date', 'ResourceID', ...metricNames].join(',') + '\n';
 const rows = data.map(day => {
   return day.metrics.map(resource => {
     const metricsRow = metricNames.map(name => {
       const metric = resource.metrics.find(m => m.metricName === name);
       return metric ? metric.metricValue : ''; // If metric not found, leave blank
     }).join(',');
     return `${day.date},${resource.resourceId},${metricsRow}`;
   }).join('\n');
 }).join('\n');
 return header + rows;
}
// Function to convert cumulative data to CSV format
function convertCumulativeToCSV(data, metricNames) {
 const header = ['ResourceID', 'CumulativeMetric', ...metricNames].join(',') + '\n';
 const rows = data.map(resource => {
   const metricsRow = metricNames.map(name => {
     const metric = resource.metrics.find(m => m.metricName === name);
     return metric ? metric.metricValue : ''; // If metric not found, leave blank
   }).join(',');
   return `${resource.resourceId},${resource.cumulativeMetric},${metricsRow}`;
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
// Function to fetch metrics for all resources (agents or queues) and return them grouped by date
const fetchMetrics = async (filters, groupings, metrics, dateRange) => {
 const dailyMetrics = [];
 for (const date of dateRange) {
   const input = {
     ResourceArn: process.env.InstanceArn,
     StartTime: new Date(`${date}T00:00:00Z`),
     EndTime: new Date(`${date}T23:59:59Z`),
     Interval: { IntervalPeriod: "DAY" },
     Filters: filters,
     Groupings: groupings,
     Metrics: metrics,
   };
   try {
     const command = new GetMetricDataV2Command(input);
     const data = await client.send(command);
     const metricsForDate = {
       date,
       metrics: [],
     };
     if (data.MetricResults && data.MetricResults.length > 0) {
       data.MetricResults.forEach(result => {
         const resourceId = result.Dimensions ? Object.values(result.Dimensions)[0] : "Unknown";
         const resultMetrics = result.Collections.map(collection => ({
           metricName: collection.Metric.Name,
           metricValue: collection.Value,
         }));
         metricsForDate.metrics.push({
           resourceId,
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
// Function to aggregate daily metrics into cumulative metrics
function aggregateMetrics(dailyMetrics) {
 const cumulativeData = [];
 dailyMetrics.forEach(day => {
   day.metrics.forEach(resource => {
     let resourceData = cumulativeData.find(item => item.resourceId === resource.resourceId);
     if (!resourceData) {
       resourceData = { resourceId: resource.resourceId, cumulativeMetric: 0, metrics: [] };
       cumulativeData.push(resourceData);
     }
     resource.metrics.forEach(metric => {
       resourceData.cumulativeMetric += metric.metricValue;
       let existingMetric = resourceData.metrics.find(m => m.metricName === metric.metricName);
       if (existingMetric) {
         existingMetric.metricValue += metric.metricValue;
       } else {
         resourceData.metrics.push({ metricName: metric.metricName, metricValue: metric.metricValue });
       }
     });
   });
 });
 return cumulativeData;
}
// Main handler function
export const handler = async (event) => {
 const { startDate, endDate, format, isCumulativeReport, resourceType } = event;
 const instanceArn = process.env.InstanceArn;
 const bucketName = process.env.S3_BUCKET_NAME;
 if (!bucketName) {
   return { statusCode: 500, body: JSON.stringify({ error: "S3 bucket name is not set in environment variables." }) };
 }
 if (!startDate || !endDate || !resourceType) {
   return { statusCode: 400, body: JSON.stringify({ error: "Missing required parameters in the event." }) };
 }
 const validResourceTypes = ["queues", "agents"];
 if (!validResourceTypes.includes(resourceType)) {
   return { statusCode: 400, body: JSON.stringify({ error: `Invalid resource type: ${resourceType}. Must be one of: ${validResourceTypes.join(", ")}` }) };
 }
 const dateRange = getDateRange(startDate, endDate);
 const filters = resourceType === "queues" ? { FilterKey: "Queue", FilterValues: await fetchAllQueueIds() } : { FilterKey: "Agent", FilterValues: ["ALL"] };
 const groupings = [resourceType.toUpperCase()];
 const metrics = [
   { Name: "CONTACTS_HANDLED", Unit: "COUNT" },
   { Name: "AVG_HANDLE_TIME", Unit: "SECONDS" },
   { Name: "CONTACTS_ABANDONED", Unit: "COUNT" },
 ];
 try {
   const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
   const metricNames = metrics.map(m => m.Name);
   let fileContent;
   if (isCumulativeReport) {
     const cumulativeData = aggregateMetrics(dailyMetrics);
     fileContent = format === 'csv' ? convertCumulativeToCSV(cumulativeData, metricNames) : convertToJSON(cumulativeData);
   } else {
     fileContent = format === 'csv' ? convertDailyToCSV(dailyMetrics, metricNames) : convertToJSON(dailyMetrics);
   }
   const fileName = `${resourceType}-${isCumulativeReport ? 'cumulative' : 'daily'}-report-${Date.now()}.${format}`;
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

this is the error, this is what I am facig.
2024-11-22T02:41:56.060Z	917d6004-0751-4eb8-9920-26f071fb6279	ERROR	Error fetching metrics for date 2024-11-10: AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/historicalMetricsLambda-role-jmzyjcfk/historicalMetricsLambda is not authorized to perform: connect:* on resource: * with an explicit deny
    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)
    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22
    at async fetchMetrics (file:///var/task/index.mjs:90:19)
    at async Runtime.handler (file:///var/task/index.mjs:166:25) {
  '$fault': 'client',


write a support ticket noes to amws team about this issue
