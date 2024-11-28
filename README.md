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
 const validResourceTypes = ["queue", "agent"];
 if (!validResourceTypes.includes(resourceType)) {
   return { statusCode: 400, body: JSON.stringify({ error: `Invalid resource type: ${resourceType}. Must be one of: ${validResourceTypes.join(", ")}` }) };
 }
 const dateRange = getDateRange(startDate, endDate);
 const queueIds = await fetchAllQueueIds();
 console.log( "queueID:", queueIds)
 const filters = [{ FilterKey: "QUEUE", FilterValues: queueIds }];
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

this is a reference code in which historical metrics api is working the input can see it. similarly modify the below one.

don't change anything else apart from that

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, GetMetricDataV2Command, GetContactAttributesCommand, ListQueuesCommand } from '@aws-sdk/client-connect';
import { subDays, format } from 'date-fns';

const s3 = new S3Client();
const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch all queue IDs
const fetchAllQueueIds = async () => {
  const queueIds = [];
  try {
    const listQueuesCommand = new ListQueuesCommand({
      InstanceId: process.env.InstanceId, // Ensure this environment variable is set
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

export const handler = async () => {
  const bucketName = 'customeroutbound-data';
  const fileName = 'CustomerOutboundNumber.csv';
  const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';
  
  const yesterdayStart = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T00:00:00Z`;
  const yesterdayEnd = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T23:59:59Z`;

  try {
    // Fetch CSV from S3
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

    // Fetch metrics from Amazon Connect
    const fetchMetrics = async () => {
      const queueIds = await fetchAllQueueIds();
      console.log("queues:", queueIds)

      if (queueIds.length === 0) {
        console.log("No queues found");
        return [];
      }

      const metricDataInput = {
        ResourceArn: `arn:aws:connect:us-east-1:768637739934:instance/${instanceId}`,
        StartTime: new Date(yesterdayStart),
        EndTime: new Date(yesterdayEnd),
        Interval: { IntervalPeriod: 'DAY' },
        Filters: [{ FilterKey: "QUEUE", FilterValues: queueIds }],
        Groupings: ["QUEUE"],
        Metrics: [
          { Name: "CONTACTS_HANDLED", Unit: "COUNT" },
          
          { Name: "CONTACTS_ABANDONED", Unit: "COUNT" },
        ]
      };

      const metricCommand = new GetMetricDataV2Command(metricDataInput);
      try {
        const metricResponse = await client.send(metricCommand);
        return metricResponse.MetricResults || [];
      } catch (error) {
        console.error('Error fetching metric data:', error);
        return [];
      }
    };

    const metricResults = await fetchMetrics();
    const contactDetails = [];

    // Extract and format contact details from metric results
    for (const result of metricResults) {
      const agentId = result.Dimensions?.AGENT || 'N/A';
      const phoneNumber = result.Dimensions?.PhoneNumber || 'N/A';
      const disposition = result.Dimensions?.Disposition || 'Unknown';

      for (const collection of result.Collections) {
        const contactId = result.Dimensions?.ContactId || 'N/A';
        if (collection.Metric.Name === 'CONTACTS_HANDLED' && collection.Value > 0) {
          // Fetch contact attributes for handled contacts
          const attributesCommand = new GetContactAttributesCommand({
            InstanceId: instanceId,
            InitialContactId: contactId,
          });

          const attributesResponse = await client.send(attributesCommand);

          contactDetails.push({
            contactId,
            agentId,
            timestamp: new Date().toISOString(),
            outboundPhoneNumber: phoneNumber,
            disposition: disposition || 'Completed',
            attributes: attributesResponse.Attributes || {},
          });
        } else if (collection.Metric.Name === 'CONTACTS_ABANDONED' && collection.Value > 0) {
          contactDetails.push({
            contactId,
            agentId,
            timestamp: new Date().toISOString(),
            outboundPhoneNumber: phoneNumber,
            disposition: 'Abandoned',
            attributes: {},
          });
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Contact details fetched successfully.',
        contactDetails,
      }),
    };
  } catch (error) {
    console.error('Error processing the Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error.stack }),
    };
  }
}
