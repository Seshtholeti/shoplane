import { ConnectClient, GetCurrentMetricDataCommand, ListQueuesCommand } from "@aws-sdk/client-connect";
// Initialize the Connect client
const client = new ConnectClient({ region: 'us-east-1'});
/**
* Fetches the list of Queue IDs dynamically from Amazon Connect
* @param {string} instanceId - Amazon Connect instance ID
* @returns {Array<string>} - List of queue IDs
*/
const getQueueIds = async (instanceId) => {
 try {
   const input = {
     InstanceId: instanceId,
     MaxResults: 100, // Adjust based on your needs; max is 100 per request
   };
   const command = new ListQueuesCommand(input);
   const response = await client.send(command);
   // Extract Queue IDs
   const queueIds = response.QueueSummaryList.map((queue) => queue.Id);
   return queueIds;
 } catch (error) {
   console.error("Error fetching queue IDs:", error);
   throw new Error("Failed to retrieve queue IDs");
 }
};
/**
* Lambda handler function to fetch real-time metrics for agents
* @param {Object} event - Lambda event object
* @returns {Object} - Real-time agent metrics response
*/
export const handler = async (event) => {
 const instanceId = process.env.INSTANCE_ID || event.instanceId;
 try {
   // Dynamically fetch Queue IDs
   const queueIds = await getQueueIds(instanceId);
   if (queueIds.length === 0) {
     return {
       statusCode: 404,
       body: JSON.stringify({ message: "No queues found in the instance." }),
     };
   }
   // Define input for GetCurrentMetricDataCommand
   const input = {
     InstanceId: instanceId,
     Filters: {
       Queues: queueIds,
       Channels: ["VOICE"], // Filter by channel, e.g., VOICE, CHAT
     },
     Groupings: ["QUEUE"], // Group data by queue
     CurrentMetrics: [
       { Name: "AGENTS_ONLINE", Unit: "COUNT" },
       { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
       { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
       { Name: "AGENTS_NON_PRODUCTIVE", Unit: "COUNT" },
       { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
       { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
       { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
     ],
     MaxResults: 10,
   };
   const command = new GetCurrentMetricDataCommand(input);
   const response = await client.send(command);
   // Process and format the metrics data
   const metricsData = response.MetricResults.map((result) => ({
     queueId: result.Dimensions?.Queue?.Id || "Unknown",
     metrics: result.Collections.map((metricData) => ({
       metricName: metricData.Metric.Name,
       metricValue: metricData.Value,
     })),
   }));
   return {
     statusCode: 200,
     body: JSON.stringify({ data: metricsData, snapshotTime: response.DataSnapshotTime }),
   };
 } catch (error) {
   console.error("Error fetching real-time metrics:", error);
   return {
     statusCode: 500,
     body: JSON.stringify({ error: error.message }),
   };
 }
};
