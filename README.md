// const AWS = require("aws-sdk");
import AWS from 'aws-sdk';
var connect = new AWS.Connect({ apiVersion: '2017-08-08' });

// Fetch real-time metrics

async function getCurrentMetrics() {

   const currentTime = new Date();

   const endTime = Math.floor(currentTime.getTime() / 1000);

   const startTime = new Date(currentTime.getTime() - (30 * 24 * 60 * 60 * 1000));

   const unixStartTimestamp = Math.floor(startTime.getTime() / 1000);

   console.log("Start time:", unixStartTimestamp);

   console.log("End time:", endTime);

   var genAI_kmdb_queue = process.env.genAI_kmdb_queue;

   var BasicQueue = process.env.BasicQueue;

   var params = {

       InstanceId: process.env.InstanceId,  

       Filters: {

           Channels: ['VOICE'],  

           Queues: [genAI_kmdb_queue, BasicQueue]  
       },

       CurrentMetrics: [


           { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },

           { Name: "AGENTS_ON_CALL", Unit: "COUNT" }

       ]

   };

   try {

       const data = await connect.getCurrentMetricData(params).promise();

       console.log("Real-time metrics:", JSON.stringify(data));

       return convertToObject(data);

   } catch (err) {

       console.error("Error fetching real-time metrics:", err);

       throw err;

   }

}

// Fetch historical metrics

async function getHistoricalMetrics() {

   const currentTime = new Date();

   const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;

   const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);

   const unixStartTimestamp = Math.floor(startTime.getTime() / 1000);

   const endTime = new Date(startTime.getTime() - (120 * 60 * 1000)); // Last 2 hours

   const unixEndTimestamp = Math.floor(endTime.getTime() / 1000);

   console.log("Historical start time:", unixStartTimestamp);

   console.log("Historical end time:", unixEndTimestamp);

   var genAI_kmdb_queue = process.env.genAI_kmdb_queue;

   var BasicQueue = process.env.BasicQueue;

   var params = {

       ResourceArn: process.env.ResourceArn,

       StartTime: unixEndTimestamp,

       EndTime: unixStartTimestamp,

       Filters: [

           {

               FilterKey: "QUEUE",

               FilterValues: [genAI_kmdb_queue, BasicQueue]

           }

       ],

       Metrics: [

           

           {

               Name: "SUM_CONTACTS_ABANDONED_IN_X",

               Threshold: [{

                   Comparison: "LT",

                   ThresholdValue: 7200

               }]

           }

       ]

   };

   try {

       const data = await connect.getMetricDataV2(params).promise();

       console.log("Historical metrics:", JSON.stringify(data));

       return convertToObject(data);

   } catch (err) {

       console.error("Error fetching historical metrics:", err);

       throw err;

   }

}

// Handler function to call both APIs and return all metrics

export async function handler(event, context) {

   try {

       // Fetch both real-time and historical metrics

       const currentMetrics = await getCurrentMetrics();

       const historicalMetrics = await getHistoricalMetrics();

       // Combine both results

       const allMetrics = {

           realTimeMetrics: currentMetrics,

           historicalMetrics: historicalMetrics

       };

       console.log("Combined metrics:", JSON.stringify(allMetrics));

       return allMetrics;

   } catch (err) {

       console.error("Error in handler:", err);

       throw err;

   }

}

module.exports = {

   handler,

   getCurrentMetrics,

   getHistoricalMetrics

};

// Function to convert API response into a clean object

function convertToObject(data) {

   const result = {};

   for (let i = 0; i < data['MetricResults'].length; i++) {

       for (let j = 0; j < data['MetricResults'][i]['Collections'].length; j++) {

           const metricName = data['MetricResults'][i]['Collections'][j]['Metric']['Name'];

           const metricValue = data['MetricResults'][i]['Collections'][j]['Value'];

           result[metricName] = metricValue;

       }

   }

   console.log(result, 'Formatted Metrics');

   return result;

}

 this is the error

{
  "errorType": "Error",
  "errorMessage": "Cannot find package 'aws-sdk' imported from /var/task/index.mjs",
  "trace": [
    "Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'aws-sdk' imported from /var/task/index.mjs",
    "    at new NodeError (node:internal/errors:405:5)",
    "    at packageResolve (node:internal/modules/esm/resolve:965:9)",
    "    at moduleResolve (node:internal/modules/esm/resolve:1022:20)",
    "    at moduleResolveWithNodePath (node:internal/modules/esm/resolve:876:12)",
    "    at defaultResolve (node:internal/modules/esm/resolve:1255:79)",
    "    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)",
    "    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)",
    "    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)",
    "    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)",
    "    at link (node:internal/modules/esm/module_job:75:36)"
  ]
}
