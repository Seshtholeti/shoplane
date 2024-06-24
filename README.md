const AWS = require("aws-sdk");
var connect = new AWS.Connect({apiVersion: '2017-08-08'});
async function getGroupMetrics(){
   const currentTime = new Date();
   const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;
   const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
   var unixStartTimestamp = Math.floor(startTime.getTime()/1000);
   console.log("unixTimestamp", unixStartTimestamp);
   const endTime = new Date(startTime.getTime() - (120 * 60 * 1000));
   var unixEndTimestamp = Math.floor(endTime.getTime()/1000);
   console.log("End time", unixEndTimestamp);
   var genAI_kmdb_queue = process.env.genAI_kmdb_queue;
   var BasicQueue = process.env.BasicQueue;
   var params = {
       ResourceArn: process.env.ResourceArn,
       StartTime: unixEndTimestamp,
       EndTime: unixStartTimestamp,
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
