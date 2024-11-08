import { ConnectClient, ListQueuesCommand, ListUsersCommand, GetCurrentMetricDataCommand, GetMetricDataV2Command } from "@aws-sdk/client-connect";
const client = new ConnectClient({ region: 'us-east-1' });
// Function to fetch queues dynamically using ListQueues
async function getQueues() {
   const input = { InstanceId: process.env.InstanceId };
   try {
       const command = new ListQueuesCommand(input);
       const data = await client.send(command);
       const queueIds = data.QueueSummaryList.map(queue => queue.Id);
    //   // Limit to a maximum of 10 queues to prevent filter issues
    //   const limitedQueueIds = queueIds.slice(0, 10);
    //   console.log("Fetched and limited Queues:", limitedQueueIds);
    //   return limitedQueueIds;
    console.log("Fetched Queues:", queueIds);
       return queueIds; 
   } catch (err) {
       console.error("Error fetching queues:", err);
       throw err;
   }
}
// Function to fetch agents dynamically using ListUsers
async function getAgents() {
   const input = { InstanceId: process.env.InstanceId };
   try {
       const command = new ListUsersCommand(input);
       const data = await client.send(command);
       const agentIds = data.UserSummaryList.map(user => user.Id);
       // Limit to a maximum of 10 agents 
       const limitedAgentIds = agentIds.slice(0, 10);
       console.log("Fetched and limited Agents:", limitedAgentIds);
       return limitedAgentIds;
   } catch (err) {
       console.error("Error fetching agents:", err);
       throw err;
   }
}
// Fetch real-time metrics
async function getCurrentMetrics() {
   const queues = await getQueues();
   const agents = await getAgents();
   const input = {
       InstanceId: process.env.InstanceId,
       Filters: {
           Channels: ['VOICE'],
           Queues: queues,
           Agents: agents,
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
       console.log("Real-time metrics:", JSON.stringify(data));
       return convertToObject(data);
   } catch (err) {
       console.error("Error fetching real-time metrics:", err);
       throw err;
   }
}
// Fetch historical metrics
async function getHistoricalMetrics() {
   const queues = await getQueues();
   const agents = await getAgents();
   const input = {
       ResourceArn: process.env.ResourceArn,
       StartTime: new Date(Date.now() - (120 * 60 * 1000)), // 2 hours ago
       EndTime: new Date(),
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
           { FilterKey: "AGENT", FilterValues: agents },
       ],
   };
   try {
       const command = new GetMetricDataV2Command(input);
       const data = await client.send(command);
       console.log("Historical metrics:", JSON.stringify(data));
       return convertToObject(data);
   } catch (err) {
       console.error("Error fetching historical metrics:", err);
       throw err;
   }
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
       console.log("Combined metrics:", JSON.stringify(allMetrics));
       return allMetrics;
   } catch (err) {
       console.error("Error in handler:", err);
       throw err;
   }
}
// Function to convert API response into a clean object
function convertToObject(data) {
   const result = {};
   for (let i = 0; i < data.MetricResults.length; i++) {
       for (let j = 0; j < data.MetricResults[i].Collections.length; j++) {
           const metricName = data.MetricResults[i].Collections[j].Metric.Name;
           const metricValue = data.MetricResults[i].Collections[j].Value;
           result[metricName] = metricValue;
       }
   }
   console.log(result, 'Formatted Metrics');
   return result;
}
export { handler, getCurrentMetrics, getHistoricalMetrics };
