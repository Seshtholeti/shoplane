// const AWS = require("aws-sdk");
// var connect = new AWS.Connect({apiVersion: '2017-08-08'});
// async function getGroupMetrics(){
//    const currentTime = new Date();
//    const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;
//    const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
//    var unixStartTimestamp = Math.floor(startTime.getTime()/1000);
//    console.log("unixTimestamp", unixStartTimestamp);
//    const endTime = new Date(startTime.getTime() - (120 * 60 * 1000));
//    var unixEndTimestamp = Math.floor(endTime.getTime()/1000);
//    console.log("End time", unixEndTimestamp);
//    var genAI_kmdb_queue = process.env.genAI_kmdb_queue;
//    var BasicQueue = process.env.BasicQueue;
//    var params = {
//        ResourceArn: process.env.ResourceArn,
//        StartTime: unixEndTimestamp,
//        EndTime: unixStartTimestamp,
//        Filters: [
//           {
//                FilterKey: "QUEUE",
//                FilterValues: [genAI_kmdb_queue, BasicQueue],
//           },
//        ],
//        Metrics: [
//           { Name: "AGENT_ANSWER_RATE" },
//           { Name: "CONTACTS_HANDLED" },
//           { Name: "MAX_QUEUED_TIME" },
//           {
//                Name: "SUM_CONTACTS_ANSWERED_IN_X",
//                Threshold: [{
//                    Comparison: "LT",
//                    ThresholdValue: 7200
//                }]
//           }
//        ]
//    };
//    try {
//        const data = await connect.getMetricDataV2(params).promise();
//        console.log(JSON.stringify(data));
//        return data;
//    } catch (err) {
//        console.error("Error fetching metrics:", err);
//        throw err; 
//    }
// }

// async function handler(event, context) {
//    try {
//        const result = await getGroupMetrics();
//        return result;
//    } catch (err) {
//        console.error("Error in handler:", err);
//        throw err; 
//    }
// }
// module.exports = {
//    handler, 
//    getGroupMetrics 
// };
const AWS = require("aws-sdk");
var connect = new AWS.Connect({ apiVersion: '2017-08-08' });
async function getGroupMetrics() {
   const currentTime = new Date();
   // Calculate end time (one month before current time)
   const endTime = Math.floor(currentTime.getTime() / 1000);
   // Calculate start time (one month before end time)
   const startTime = new Date(currentTime.getTime() - (30 * 24 * 60 * 60 * 1000));
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
       return convertToObject(data);
   } catch (err) {
       console.error("Error fetching metrics:", err);
       throw err;
   }
}
async function handler(event, context) {
   try {
       const result = await getGroupMetrics();
      //  let res;
      //  res = convertToObject(result['collections'])
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


function convertToObject(data) {
const result = {};
console.log(data['MetricResults'][0]['Collections'].length,'convertToObject')
// data.MetricResults.forEach(item => {
// item.Collections.forEach(collection => {
//   const key = collection.Metric.Name;
//   const value = collection.value;
//   result[key] = value;
// });
// });
for (let i=0;i<data['MetricResults'].length;i++){
    console.log('dataMetricresults',i,data['MetricResults'][i])
    for(let j =0 ;j<data['MetricResults'][i]['Collections'].length;j++){
console.log(data['MetricResults'][i]['Collections'][j]['Metric']['Name'],'res12',data['MetricResults'][i]['Collections'][j]['Value'])
        result[data['MetricResults'][i]['Collections'][j]['Metric']['Name']]=data['MetricResults'][i]['Collections'][j]['Value']
    }
    
}
console.log(result,'res')
return result;
}
