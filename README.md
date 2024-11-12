import { ConnectClient, ListQueuesCommand, ListUsersCommand, GetCurrentMetricDataCommand } from "@aws-sdk/client-connect";
const client = new ConnectClient({ region: 'us-east-1' });
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
// Function to fetch agents dynamically using ListUsers
async function getAgents() {
   const input = { InstanceId: process.env.InstanceId };
   try {
       const command = new ListUsersCommand(input);
       const data = await client.send(command);
       const agentIds = data.UserSummaryList.map(user => user.Id);
       console.log("Fetched Agents:", agentIds);
       return agentIds;
   } catch (err) {
       console.error("Error fetching agents:", err);
       throw err;
   }
}
// Fetch real-time metrics for queues
async function getQueueRealTimeMetrics() {
   const queues = await getQueues();
   const input = {
       InstanceId: process.env.InstanceId,
       Filters: {
          Channels: ['VOICE'],
          Queues: queues,
       },
       CurrentMetrics: [
          { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
          { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
          { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
       ],
   };
   try {
       const command = new GetCurrentMetricDataCommand(input);
       const data = await client.send(command);
       const metricsObject = convertToObject(data);
       return { type: "queue", metrics: metricsObject };
   } catch (err) {
       console.error("Error fetching queue real-time metrics:", err);
       throw err;
   }
}
// Fetch real-time metrics for agents
async function getAgentRealTimeMetrics() {
   const agents = await getAgents();
   const queues = await getQueues();
   const input = {
       InstanceId: process.env.InstanceId,
       Filters: {
          Channels: ['VOICE'],
          Agents: agents,Queues:queues
       },
       CurrentMetrics: [
          { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
          { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
          { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
          { Name: "AGENTS_ONLINE", Unit: "COUNT" },
       ],
   };
   try {
       const command = new GetCurrentMetricDataCommand(input);
       const data = await client.send(command);
       const metricsObject = convertToObject(data);
       return { type: "agent", metrics: metricsObject };
   } catch (err) {
       console.error("Error fetching agent real-time metrics:", err);
       throw err;
   }
}
// Function to convert API response into a clean object
function convertToObject(data) {
   const result = {};
   if (data && data.MetricResults) {
       for (const metricResult of data.MetricResults) {
          for (const collection of metricResult.Collections) {
               const metricName = collection.Metric.Name;
               const metricValue = collection.Value;
               result[metricName] = metricValue;
          }
       }
   }
   console.log('Formatted Metrics:', result);
   return result;
}
// Handler function for real-time metrics
export const handler = async (event) => {
   try {
       const queueMetrics = await getQueueRealTimeMetrics();
       const agentMetrics = await getAgentRealTimeMetrics();
       const allMetrics = {
          queueRealTimeMetrics: queueMetrics,
          agentRealTimeMetrics: agentMetrics,
       };
       console.log("Combined real-time metrics:", JSON.stringify(allMetrics));
       return allMetrics;
   } catch (err) {
       console.error("Error in handler:", err);
       throw err;
   }
};
