use this
function convertToObject(data) {
const result = {};
data.forEach(item => {
const key = item.Metric.Name;
const value = item.Value;
result[key] = value;
});
return result;
}



const AWS = require("aws-sdk");
var connect = new AWS.Connect({ apiVersion: '2017-08-08' });
async function getGroupMetrics() {
   const currentTime = new Date();
   // Calculate end time (one month before current time)
   const endTime = Math.floor(currentTime.getTime() / 1000);
   // Calculate start time (one month before end time)
   const startTime = new Date(currentTime.getTime() - (30 * 24 * 60 * 60 * 1000)); // Approximately 30 days ago
   const unixStartTimestamp = Math.floor(startTime.getTime() / 1000);
   console.log("Start time:", unixStartTimestamp);
   console.log("End time:", endTime);
   var genAI_kmdb_queue = process.env.genAI_kmdb_queue;
   var BasicQueue = process.env.BasicQueue;
   var params = {
       ResourceArn: process.env.ResourceArn,
       StartTime: unixStartTimestamp,
       EndTime: endTime,
       Filters: [
           {
               FilterKey: "QUEUE",
               FilterValues: [genAI_kmdb_queue, BasicQueue],
           },
       ],
       Metrics: [
           { Name: "AGENT_ANSWER_RATE" },
           { Name: "CONTACTS_HANDLED" },
           { Name: "MAX_QUEUED_TIME" },
           {
               Name: "SUM_CONTACTS_ANSWERED_IN_X",
               Threshold: [{
                   Comparison: "LT",
                   ThresholdValue: 7200
               }]
           }
       ]
   };
   try {
       const data = await connect.getMetricDataV2(params).promise();
       console.log(JSON.stringify(data));
       return data;
   } catch (err) {
       console.error("Error fetching metrics:", err);
       throw err;
   }
}
async function handler(event, context) {
   try {
       const result = await getGroupMetrics();
       return result;
   } catch (err) {
       console.error("Error in handler:", err);
       throw err;
   }
}
module.exports = {
   handler,
   getGroupMetrics
};

