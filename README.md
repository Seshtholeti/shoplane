import { ConnectClient, ListQueuesCommand, GetCurrentMetricDataCommand, GetMetricDataV2Command } from "@aws-sdk/client-connect";
import { DynamoDBClient, CreateTableCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
// Initialize AWS SDK clients
const client = new ConnectClient({ region: 'us-east-1' });
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
// Function to create the DynamoDB table
async function createTable() {
   const params = {
       TableName: 'MetricData',
       KeySchema: [
           { AttributeName: 'metricType', KeyType: 'HASH' },  // Partition key
           { AttributeName: 'date', KeyType: 'RANGE' },       // Sort key
       ],
       AttributeDefinitions: [
           { AttributeName: 'metricType', AttributeType: 'S' },
           { AttributeName: 'date', AttributeType: 'S' },
       ],
       ProvisionedThroughput: {
           ReadCapacityUnits: 5,
           WriteCapacityUnits: 5,
       },
   };
   try {
       const command = new CreateTableCommand(params);
       const data = await dynamoDbClient.send(command);
       console.log("Table created successfully:", data);
   } catch (err) {
       console.error("Error creating table:", err);
   }
}
// Function to fetch queues dynamically using list queues
async function getQueues() {
   const input = {
       InstanceId: process.env.InstanceId,
   };
   try {
       const command = new ListQueuesCommand(input);
       const data = await client.send(command);
       const queueIds = data.QueueSummaryList.map(queue => queue.Id);
       console.log("Fetched Queues:", queueIds);
       return queueIds;
   } catch (err) {
       console.error("Error fetching queues:", err);
       throw err;
   }
}
// Fetch real-time metrics for each day over one month
async function getCurrentMetrics() {
   const currentTime = new Date();
   const endDate = new Date(currentTime);
   const startDate = new Date();
   startDate.setMonth(startDate.getMonth() - 1);
   console.log("Fetching daily real-time metrics from:", startDate.toISOString(), "to", endDate.toISOString());
   const queues = await getQueues();
   const dailyRealTimeMetrics = [];
   // Loop through each day in the range
   for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
       const startTime = new Date(date);
       const endTime = new Date(date);
       endTime.setHours(23, 59, 59, 999);
       const input = {
           InstanceId: process.env.InstanceId,
           Filters: {
               Channels: ['VOICE'],
               Queues: queues,
           },
           CurrentMetrics: [
               { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
               { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
               { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
               { Name: "AGENTS_ONLINE", Unit: "COUNT" },
               { Name: "AGENTS_STAFFED", Unit: "COUNT" },
               { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
           ],
       };
       try {
           const command = new GetCurrentMetricDataCommand(input);
           const data = await client.send(command);
           const metricsObject = convertToObject(data);
           if (Object.keys(metricsObject).length === 0) {
               console.log(`No real-time metrics data available for ${startTime.toISOString().split('T')[0]}`);
           } else {
               dailyRealTimeMetrics.push({
                   date: startTime.toISOString().split('T')[0],
                   metrics: metricsObject,
               });
               console.log(`Real-time Metrics for ${startTime.toISOString().split('T')[0]}:`, metricsObject);
               // Store the real-time metrics in DynamoDB
               await storeMetrics('realTime', startTime.toISOString().split('T')[0], metricsObject);
           }
       } catch (err) {
           console.error(`Error fetching real-time metrics for ${startTime.toISOString().split('T')[0]}:`, err);
       }
   }
   return dailyRealTimeMetrics;
}
// Fetch historical metrics for each day over one month
async function getHistoricalMetrics() {
   const currentTime = new Date();
   const endDate = new Date(currentTime);
   const startDate = new Date();
   startDate.setMonth(startDate.getMonth() - 1);
   console.log("Fetching daily historical metrics from:", startDate.toISOString(), "to", endDate.toISOString());
   const queues = await getQueues();
   const dailyHistoricalMetrics = [];
   for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
       const startTime = new Date(date);
       const endTime = new Date(date);
       endTime.setHours(23, 59, 59, 999);
       const input = {
           ResourceArn: process.env.ResourceArn,
           StartTime: startTime,
           EndTime: endTime,
           Metrics: [
               { Name: "SUM_CONTACTS_ABANDONED_IN_X", Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }] },
               { Name: "SUM_CONTACTS_ANSWERED_IN_X", Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }] },
               { Name: "ABANDONMENT_RATE", Unit: "COUNT" },
               { Name: "AGENT_ANSWER_RATE" },
               { Name: "CONTACTS_HANDLED" },
               { Name: "MAX_QUEUED_TIME" },
               { Name: "AVG_HANDLE_TIME" },
           ],
           Filters: [
               { FilterKey: "QUEUE", FilterValues: queues },
           ],
       };
       try {
           const command = new GetMetricDataV2Command(input);
           const data = await client.send(command);
           const metricsObject = convertToObject(data);
           dailyHistoricalMetrics.push({
               date: startTime.toISOString().split('T')[0],
               metrics: metricsObject,
           });
           console.log(`Historical Metrics for ${startTime.toISOString().split('T')[0]}:`, metricsObject);
           // Store the historical metrics in DynamoDB
           await storeMetrics('historical', startTime.toISOString().split('T')[0], metricsObject);
       } catch (err) {
           console.error(`Error fetching historical metrics for ${startTime.toISOString().split('T')[0]}:`, err);
       }
   }
   return dailyHistoricalMetrics;
}
// Handler function to call both APIs and return all metrics
async function handler(event, context) {
   try {
       const currentMetrics = await getCurrentMetrics();
       const historicalMetrics = await getHistoricalMetrics();
       const allMetrics = {
           realTimeMetrics: currentMetrics,
           historicalMetrics: historicalMetrics,
       };
       console.log("Combined metrics for one month:", JSON.stringify(allMetrics));
       return allMetrics;
   } catch (err) {
       console.error("Error in handler:", err);
       throw err;
   }
}
// Function to convert API response into a clean object
function convertToObject(data) {
   const result = {};
   if (data && data.MetricResults) {
       for (let i = 0; i < data.MetricResults.length; i++) {
           for (let j = 0; j < data.MetricResults[i].Collections.length; j++) {
               const metricName = data.MetricResults[i].Collections[j].Metric.Name;
               const metricValue = data.MetricResults[i].Collections[j].Value;
               result[metricName] = metricValue;
           }
       }
   }
   console.log(result, 'Formatted Metrics');
   return result;
}
// Function to store metrics in DynamoDB
async function storeMetrics(metricType, date, metrics) {
   const params = {
       TableName: 'MetricData',
       Item: {
           metricType: { S: metricType },
           date: { S: date },
           metrics: { S: JSON.stringify(metrics) },
       },
   };
   try {
       const command = new PutItemCommand(params);
       await dynamoDbClient.send(command);
       console.log(`Successfully stored ${metricType} metrics for ${date}`);
   } catch (err) {
       console.error("Error storing metrics in DynamoDB:", err);
       throw err;
   }
}
// Create table when the script is run
createTable().then(() => {
   console.log('Table creation process completed.');
});
export { handler, getCurrentMetrics, getHistoricalMetrics };
