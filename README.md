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
// Function to convert cumulative data to CSV format
function convertCumulativeToCSV(data, metricNames) {
 const header = ['QueueID', 'CumulativeMetric', ...metricNames].join(',') + '\n';
 const rows = data.map(queue => {
   const metricsRow = metricNames.map(name => {
     const metric = queue.metrics.find(m => m.metricName === name);
     return metric ? metric.metricValue : ''; // If metric not found, leave blank
   }).join(',');
   return `${queue.queueId},${queue.cumulativeMetric},${metricsRow}`;
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
// Function to aggregate daily metrics into cumulative metrics
function aggregateMetrics(dailyMetrics) {
 const cumulativeData = [];
 dailyMetrics.forEach(day => {
   day.metrics.forEach(queue => {
     let queueData = cumulativeData.find(item => item.queueId === queue.queueId);
     if (!queueData) {
       queueData = { queueId: queue.queueId, cumulativeMetric: 0, metrics: [] };
       cumulativeData.push(queueData);
     }
     queue.metrics.forEach(metric => {
       queueData.cumulativeMetric += metric.metricValue;
       let existingMetric = queueData.metrics.find(m => m.metricName === metric.metricName);
       if (existingMetric) {
         existingMetric.metricValue += metric.metricValue;
       } else {
         queueData.metrics.push({ metricName: metric.metricName, metricValue: metric.metricValue });
       }
     });
   });
 });
 return cumulativeData;
}
// Main handler function
export const handler = async (event) => {
 const { startDate, endDate, format, isCumulativeReport } = event;
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
   let fileContent;
   if (isCumulativeReport) {
     const cumulativeData = aggregateMetrics(dailyMetrics); // Assuming aggregateMetrics processes the dailyMetrics to create cumulative data
     fileContent = format === 'csv' ? convertCumulativeToCSV(cumulativeData, metricNames) : convertToJSON(cumulativeData);
   } else {
     fileContent = format === 'csv' ? convertDailyToCSV(dailyMetrics, metricNames) : convertToJSON(dailyMetrics);
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

import { ConnectClient, GetMetricDataV2Command } from "@aws-sdk/client-connect"; // ES Modules import
// const { ConnectClient, GetMetricDataV2Command } = require("@aws-sdk/client-connect"); // CommonJS import
const client = new ConnectClient(config);
const input = { // GetMetricDataV2Request
  ResourceArn: "STRING_VALUE", // required
  StartTime: new Date("TIMESTAMP"), // required
  EndTime: new Date("TIMESTAMP"), // required
  Interval: { // IntervalDetails
    TimeZone: "STRING_VALUE",
    IntervalPeriod: "FIFTEEN_MIN" || "THIRTY_MIN" || "HOUR" || "DAY" || "WEEK" || "TOTAL",
  },
  Filters: [ // FiltersV2List // required
    { // FilterV2
      FilterKey: "STRING_VALUE",
      FilterValues: [ // FilterValueList
        "STRING_VALUE",
      ],
    },
  ],
  Groupings: [ // GroupingsV2
    "STRING_VALUE",
  ],
  Metrics: [ // MetricsV2 // required
    { // MetricV2
      Name: "STRING_VALUE",
      Threshold: [ // ThresholdCollections
        { // ThresholdV2
          Comparison: "STRING_VALUE",
          ThresholdValue: Number("double"),
        },
      ],
      MetricFilters: [ // MetricFiltersV2List
        { // MetricFilterV2
          MetricFilterKey: "STRING_VALUE",
          MetricFilterValues: [ // MetricFilterValueList
            "STRING_VALUE",
          ],
          Negate: true || false,
        },
      ],
    },
  ],
  NextToken: "STRING_VALUE",
  MaxResults: Number("int"),
};
const command = new GetMetricDataV2Command(input);
const response = await client.send(command);
// { // GetMetricDataV2Response
//   NextToken: "STRING_VALUE",
//   MetricResults: [ // MetricResultsV2
//     { // MetricResultV2
//       Dimensions: { // DimensionsV2Map
//         "<keys>": "STRING_VALUE",
//       },
//       MetricInterval: { // MetricInterval
//         Interval: "FIFTEEN_MIN" || "THIRTY_MIN" || "HOUR" || "DAY" || "WEEK" || "TOTAL",
//         StartTime: new Date("TIMESTAMP"),
//         EndTime: new Date("TIMESTAMP"),
//       },
//       Collections: [ // MetricDataCollectionsV2
//         { // MetricDataV2
//           Metric: { // MetricV2
//             Name: "STRING_VALUE",
//             Threshold: [ // ThresholdCollections
//               { // ThresholdV2
//                 Comparison: "STRING_VALUE",
//                 ThresholdValue: Number("double"),
//               },
//             ],
//             MetricFilters: [ // MetricFiltersV2List
//               { // MetricFilterV2
//                 MetricFilterKey: "STRING_VALUE",
//                 MetricFilterValues: [ // MetricFilterValueList
//                   "STRING_VALUE",
//                 ],
//                 Negate: true || false,
//               },
//             ],
//           },
//           Value: Number("double"),
//         },
//       ],
//     },
//   ],
// };

