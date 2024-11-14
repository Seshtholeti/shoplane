import { ConnectClient, ListPhoneNumbersCommand, GetCurrentMetricDataCommand, GetMetricDataCommand } from "@aws-sdk/client-connect";
const REGION = "us-east-1"; 
const instanceId = "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21"; 
const client = new ConnectClient({ region: REGION });
/**
* Function to list all phone numbers in the Connect instance
*/
const listPhoneNumbers = async () => {
 try {
   const command = new ListPhoneNumbersCommand({ InstanceId: instanceId });
   const response = await client.send(command);
   console.log("List of Phone Numbers:", response.PhoneNumberSummaryList);
   return response.PhoneNumberSummaryList;
 } catch (error) {
   console.error("Error listing phone numbers:", error);
 }
};
/**
* Function to get real-time metrics
*/
const getRealTimeMetrics = async () => {
 try {
   const metrics = [
     { Name: "AGENTS_ONLINE", Unit: "COUNT" },
     { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
     { Name: "AGENTS_STAFFED", Unit: "COUNT" },
     { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
     { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
   ];
   const command = new GetCurrentMetricDataCommand({
     InstanceId: instanceId,
     CurrentMetrics: metrics,
     Filters: {
       Channels: ["VOICE"],
       Queues: ["*"], // Fetch metrics for all queues
     },
   });
   const response = await client.send(command);
   console.log("Real-time Metrics Data:", JSON.stringify(response.MetricResults, null, 2));
   return response.MetricResults;
 } catch (error) {
   console.error("Error fetching real-time metrics:", error);
 }
};
/**
* Function to get historical metrics for the past 30 days on a daily basis
*/
const getHistoricalMetrics = async () => {
 try {
   const metrics = [
     { Name: "AGENTS_ONLINE", Unit: "COUNT" },
     { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
     { Name: "CONTACTS_QUEUED", Unit: "COUNT" },
     { Name: "CONTACTS_HANDLED", Unit: "COUNT" },
     { Name: "AVG_HANDLE_TIME", Unit: "SECONDS" },
   ];
   const today = new Date();
   today.setUTCHours(0, 0, 0, 0);
   const thirtyDaysAgo = new Date(today);
   thirtyDaysAgo.setDate(today.getDate() - 30);
   const dailyMetrics = [];
   // Loop through each day in the past 30 days
   for (let day = 0; day < 30; day++) {
     const startTime = new Date(thirtyDaysAgo);
     startTime.setDate(thirtyDaysAgo.getDate() + day);
     const endTime = new Date(startTime);
     endTime.setUTCHours(23, 59, 59, 999);
     const command = new GetMetricDataCommand({
       InstanceId: instanceId,
       StartTime: startTime,
       EndTime: endTime,
       HistoricalMetrics: metrics,
       Filters: {
         Channels: ["VOICE"],
         Queues: ["*"], // Fetch metrics for all queues
       },
       Groupings: ["CHANNEL"], // Grouping by channel for better analysis
     });
     const response = await client.send(command);
     dailyMetrics.push({
       date: startTime.toISOString().split("T")[0],
       metrics: response.MetricResults,
     });
     console.log(`Metrics for ${startTime.toISOString().split("T")[0]}:`, JSON.stringify(response.MetricResults, null, 2));
   }
   return dailyMetrics;
 } catch (error) {
   console.error("Error fetching historical metrics:", error);
 }
};
/**
* Main function to execute the tracking of metrics
*/
const trackMetrics = async () => {
 console.log("Fetching phone numbers...");
 await listPhoneNumbers();
 console.log("\nFetching real-time metrics...");
 const realTimeData = await getRealTimeMetrics();
 console.log("\nFetching historical metrics for the past 30 days...");
 const historicalData = await getHistoricalMetrics();
 console.log("\nCompleted Metrics Tracking");
 console.log("Real-Time Data:", JSON.stringify(realTimeData, null, 2));
 console.log("Historical Data (Last 30 Days):", JSON.stringify(historicalData, null, 2));
};
// Execute the main function
trackMetrics();
