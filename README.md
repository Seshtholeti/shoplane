import { ConnectClient, ListPhoneNumbersCommand, GetCurrentMetricDataCommand, GetMetricDataV2Command } from "@aws-sdk/client-connect";
const client = new ConnectClient({ region: 'us-east-1' });
// Function to fetch phone numbers dynamically using ListPhoneNumbersV2
async function getPhoneNumbers() {
   const input = {
       InstanceId: process.env.InstanceId,
   };
   try {
       const command = new ListPhoneNumbersCommand(input);
       const data = await client.send(command);
       const phoneNumbers = data.PhoneNumberSummaryList.map(phoneNumber => phoneNumber.PhoneNumber);
       console.log("Fetched Phone Numbers:", phoneNumbers);
       return phoneNumbers;
   } catch (err) {
       console.error("Error fetching phone numbers:", err);
       throw err;
   }
}
// Fetch real-time metrics for phone numbers
async function getCurrentMetricsForPhoneNumbers() {
   const currentTime = new Date();
   const endDate = new Date(currentTime);
   const startDate = new Date();
   startDate.setMonth(startDate.getMonth() - 1);
   console.log("Fetching daily real-time metrics for phone numbers from:", startDate.toISOString(), "to", endDate.toISOString());
   const phoneNumbers = await getPhoneNumbers();
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
               PhoneNumbers: phoneNumbers,
           },
           CurrentMetrics: [
               { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
               { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
               { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
               { Name: "AGENTS_ONLINE", Unit: "COUNT" },
               { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
           ],
       };
       try {
           const command = new GetCurrentMetricDataCommand(input);
           const data = await client.send(command);
           const metricsObject = convertToObject(data);
           dailyRealTimeMetrics.push({
               date: startTime.toISOString().split('T')[0],
               metrics: metricsObject,
           });
           console.log(`Real-time Metrics for ${startTime.toISOString().split('T')[0]}:`, metricsObject);
       } catch (err) {
           console.error(`Error fetching real-time metrics for ${startTime.toISOString().split('T')[0]}:`, err);
       }
   }
   return dailyRealTimeMetrics;
}
// Fetch historical metrics for phone numbers
async function getHistoricalMetricsForPhoneNumbers() {
   const currentTime = new Date();
   const endDate = new Date(currentTime);
   const startDate = new Date();
   startDate.setMonth(startDate.getMonth() - 1);
   console.log("Fetching daily historical metrics for phone numbers from:", startDate.toISOString(), "to", endDate.toISOString());
   const phoneNumbers = await getPhoneNumbers();
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
               { Name: "CONTACTS_HANDLED" },
               { Name: "AVG_HANDLE_TIME" },
               { Name: "ABANDONMENT_RATE", Unit: "Percent" },
               { Name: "AGENT_OCCUPANCY", Unit: "Percentage" },
               { Name: "MAX_QUEUED_TIME" },
           ],
           Filters: [
               { FilterKey: "PHONENUMBER", FilterValues: phoneNumbers },
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
       } catch (err) {
           console.error(`Error fetching historical metrics for ${startTime.toISOString().split('T')[0]}:`, err);
       }
   }
   return dailyHistoricalMetrics;
}
// Handler function to call both APIs and return all metrics
async function handler(event, context) {
   try {
       const currentMetrics = await getCurrentMetricsForPhoneNumbers();
       const historicalMetrics = await getHistoricalMetricsForPhoneNumbers();
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
export { handler, getCurrentMetricsForPhoneNumbers, getHistoricalMetricsForPhoneNumbers };
