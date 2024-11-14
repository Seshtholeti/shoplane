import { ConnectClient, GetCurrentMetricDataCommand, ListQueuesCommand } from "@aws-sdk/client-connect";

// Initialize the Connect client
const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch queues dynamically using ListQueuesCommand
async function getQueues(instanceId) {
 const input = {
   InstanceId: instanceId,
 };
 try {
   const command = new ListQueuesCommand(input);
   const data = await client.send(command);
   const queueIds = data.QueueSummaryList.map(queue => queue.Id);
   return queueIds;
 } catch (err) {
   console.error("Error fetching queues:", err);
   throw err;
 }
}

export const handler = async (event) => {
 const { resourceType, selectedResources, startDate, endDate } = event;

 // Validate that selectedResources is not empty
 if (!selectedResources || selectedResources.length === 0) {
   throw new Error("You must select at least one resource.");
 }

 // Use the InstanceId from environment variables
 const instanceId = process.env.InstanceId;

 // If the resourceType is "Queues", fetch metrics for selected queues
 if (resourceType === "Queues") {
   const queueIds = selectedResources; // Queue IDs passed from the front-end

   // Prepare input for GetCurrentMetricDataCommand
   const input = {
     InstanceId: instanceId, // Use your instance ID from environment variables
     Filters: {
       Queues: queueIds, // Pass selected queue IDs
       Channels: ["VOICE"], // Adjust channels if necessary
     },
     Groupings: ["QUEUE"], // Grouping by queue
     CurrentMetrics: [
       { Name: "AGENTS_ONLINE", Unit: "COUNT" },
       { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
       { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
       { Name: "AGENTS_ERROR", Unit: "COUNT" },
       { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
       { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
       // Add other metrics as needed
     ],
     StartTime: new Date(startDate).toISOString(),
     EndTime: new Date(endDate).toISOString(),
   };

   try {
     // Fetch the real-time metrics for the selected queues
     const command = new GetCurrentMetricDataCommand(input);
     const data = await client.send(command);
     
     // Process the response and return the metrics
     const metrics = data.MetricResults.map((result) => {
       const queueMetrics = result.Collections.map((collection) => ({
         metricName: collection.Metric.Name,
         metricValue: collection.Value,
       }));
       return {
         queueId: result.Dimensions.Queue.Id,
         metrics: queueMetrics,
       };
     });

     return {
       statusCode: 200,
       body: JSON.stringify(metrics),
     };
   } catch (err) {
     console.error("Error fetching metrics:", err);
     return {
       statusCode: 500,
       body: JSON.stringify({ error: err.message }),
     };
   }
 } else {
   return {
     statusCode: 400,
     body: JSON.stringify({ error: "Unsupported resource type" }),
   };
 }
};
