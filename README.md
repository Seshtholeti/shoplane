import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConnectClient, GetCurrentMetricDataCommand} from "@aws-sdk/client-connect";
// Create an S3 client
const s3Client = new S3Client({ region: 'us-east-1' });
// The Connect client
const client = new ConnectClient({ region: 'us-east-1' });
// Function to convert data to CSV format
function convertToCSV(data) {
const header = Object.keys(data[0]).join(',') + '\n';
const rows = data.map(row => Object.values(row).join(',')).join('\n');
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
// Function to fetch metrics
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
const { resourceType, selectedResources, startDate, endDate, isCumulativeReport, format } = event;
const instanceId = process.env.InstanceId;
const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
  return { statusCode: 500, body: JSON.stringify({ error: "S3 bucket name is not set in environment variables." }) };
}
// Validate that selectedResources is not empty
if (!selectedResources || selectedResources.length === 0) {
  return { statusCode: 400, body: JSON.stringify({ error: "You must select at least one resource." }) };
}
const dateRange = getDateRange(startDate, endDate);
const filters = {
  Queues: selectedResources,
  Channels: ["VOICE"],
};
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
  const dailyMetrics = await fetchMetrics(filters, groupings, metrics, dateRange);
  let reportData;
  if (isCumulativeReport) {
    reportData = aggregateMetrics(dailyMetrics);
  } else {
    reportData = dailyMetrics;
  }
  // Convert the report to the chosen format (CSV or JSON)
  let fileContent;
  if (format === 'csv') {
    fileContent = convertToCSV(reportData);
  } else {
    fileContent = convertToJSON(reportData);
  }
  // Generate a unique file name
  const fileName = `${isCumulativeReport ? 'cumulative' : 'daily'}-report-${Date.now()}.${format}`;
  await uploadToS3(fileContent, bucketName, fileName);
  // Generate the S3 URL for accessing the file
  const fileUrl = `https://s3.amazonaws.com/${bucketName}/${fileName}`;
  // Return the S3 URL in the response
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
