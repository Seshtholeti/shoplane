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
 for thr above code use the below snippets and change the entire thing.

import { ConnectClient, GetCurrentMetricDataCommand } from "@aws-sdk/client-connect"; // ES Modules import
// const { ConnectClient, GetCurrentMetricDataCommand } = require("@aws-sdk/client-connect"); // CommonJS import
const client = new ConnectClient(config);
const input = { // GetCurrentMetricDataRequest
  InstanceId: "STRING_VALUE", // required
  Filters: { // Filters
    Queues: [ // Queues
      "STRING_VALUE",
    ],
    Channels: [ // Channels
      "VOICE" || "CHAT" || "TASK",
    ],
    RoutingProfiles: [ // RoutingProfiles
      "STRING_VALUE",
    ],
    RoutingStepExpressions: [ // RoutingExpressions
      "STRING_VALUE",
    ],
  },
  Groupings: [ // Groupings
    "QUEUE" || "CHANNEL" || "ROUTING_PROFILE" || "ROUTING_STEP_EXPRESSION",
  ],
  CurrentMetrics: [ // CurrentMetrics // required
    { // CurrentMetric
      Name: "AGENTS_ONLINE" || "AGENTS_AVAILABLE" || "AGENTS_ON_CALL" || "AGENTS_NON_PRODUCTIVE" || "AGENTS_AFTER_CONTACT_WORK" || "AGENTS_ERROR" || "AGENTS_STAFFED" || "CONTACTS_IN_QUEUE" || "OLDEST_CONTACT_AGE" || "CONTACTS_SCHEDULED" || "AGENTS_ON_CONTACT" || "SLOTS_ACTIVE" || "SLOTS_AVAILABLE",
      Unit: "SECONDS" || "COUNT" || "PERCENT",
    },
  ],
  NextToken: "STRING_VALUE",
  MaxResults: Number("int"),
  SortCriteria: [ // CurrentMetricSortCriteriaMaxOne
    { // CurrentMetricSortCriteria
      SortByMetric: "AGENTS_ONLINE" || "AGENTS_AVAILABLE" || "AGENTS_ON_CALL" || "AGENTS_NON_PRODUCTIVE" || "AGENTS_AFTER_CONTACT_WORK" || "AGENTS_ERROR" || "AGENTS_STAFFED" || "CONTACTS_IN_QUEUE" || "OLDEST_CONTACT_AGE" || "CONTACTS_SCHEDULED" || "AGENTS_ON_CONTACT" || "SLOTS_ACTIVE" || "SLOTS_AVAILABLE",
      SortOrder: "ASCENDING" || "DESCENDING",
    },
  ],
};
const command = new GetCurrentMetricDataCommand(input);
const response = await client.send(command);
// { // GetCurrentMetricDataResponse
//   NextToken: "STRING_VALUE",
//   MetricResults: [ // CurrentMetricResults
//     { // CurrentMetricResult
//       Dimensions: { // Dimensions
//         Queue: { // QueueReference
//           Id: "STRING_VALUE",
//           Arn: "STRING_VALUE",
//         },
//         Channel: "VOICE" || "CHAT" || "TASK",
//         RoutingProfile: { // RoutingProfileReference
//           Id: "STRING_VALUE",
//           Arn: "STRING_VALUE",
//         },
//         RoutingStepExpression: "STRING_VALUE",
//       },
//       Collections: [ // CurrentMetricDataCollections
//         { // CurrentMetricData
//           Metric: { // CurrentMetric
//             Name: "AGENTS_ONLINE" || "AGENTS_AVAILABLE" || "AGENTS_ON_CALL" || "AGENTS_NON_PRODUCTIVE" || "AGENTS_AFTER_CONTACT_WORK" || "AGENTS_ERROR" || "AGENTS_STAFFED" || "CONTACTS_IN_QUEUE" || "OLDEST_CONTACT_AGE" || "CONTACTS_SCHEDULED" || "AGENTS_ON_CONTACT" || "SLOTS_ACTIVE" || "SLOTS_AVAILABLE",
//             Unit: "SECONDS" || "COUNT" || "PERCENT",
//           },
//           Value: Number("double"),
//         },
//       ],
//     },
//   ],
//   DataSnapshotTime: new Date("TIMESTAMP"),
//   ApproximateTotalCount: Number("long"),
// };

import { ConnectClient, GetMetricDataV2Command } from "@aws-sdk/client-connect"; // ES Modules import
// const { ConnectClient, GetMetricDataV2Command } = require("@aws-sdk/client-connect"); // CommonJS import
const client = new ConnectClient(config);
const input = { // GetMetricDataV2Request
  ResourceArn: "STRING_VALUE", // required
  StartTime: new Date("TIMESTAMP"), // required
  EndTime: new Date("TIMESTAMP"), // required
  Interval: { // IntervalDetails
    TimeZone: "STRING_VALUE",
    IntervalPeriod: "FIFTEEN_MIN" || "THIRTY_MIN" || "HOUR" || "DAY" || "WEEK" || "TOTAL",
  },
  Filters: [ // FiltersV2List // required
    { // FilterV2
      FilterKey: "STRING_VALUE",
      FilterValues: [ // FilterValueList
        "STRING_VALUE",
      ],
    },
  ],
  Groupings: [ // GroupingsV2
    "STRING_VALUE",
  ],
  Metrics: [ // MetricsV2 // required
    { // MetricV2
      Name: "STRING_VALUE",
      Threshold: [ // ThresholdCollections
        { // ThresholdV2
          Comparison: "STRING_VALUE",
          ThresholdValue: Number("double"),
        },
      ],
      MetricFilters: [ // MetricFiltersV2List
        { // MetricFilterV2
          MetricFilterKey: "STRING_VALUE",
          MetricFilterValues: [ // MetricFilterValueList
            "STRING_VALUE",
          ],
          Negate: true || false,
        },
      ],
    },
  ],
  NextToken: "STRING_VALUE",
  MaxResults: Number("int"),
};
const command = new GetMetricDataV2Command(input);
const response = await client.send(command);
// { // GetMetricDataV2Response
//   NextToken: "STRING_VALUE",
//   MetricResults: [ // MetricResultsV2
//     { // MetricResultV2
//       Dimensions: { // DimensionsV2Map
//         "<keys>": "STRING_VALUE",
//       },
//       MetricInterval: { // MetricInterval
//         Interval: "FIFTEEN_MIN" || "THIRTY_MIN" || "HOUR" || "DAY" || "WEEK" || "TOTAL",
//         StartTime: new Date("TIMESTAMP"),
//         EndTime: new Date("TIMESTAMP"),
//       },
//       Collections: [ // MetricDataCollectionsV2
//         { // MetricDataV2
//           Metric: { // MetricV2
//             Name: "STRING_VALUE",
//             Threshold: [ // ThresholdCollections
//               { // ThresholdV2
//                 Comparison: "STRING_VALUE",
//                 ThresholdValue: Number("double"),
//               },
//             ],
//             MetricFilters: [ // MetricFiltersV2List
//               { // MetricFilterV2
//                 MetricFilterKey: "STRING_VALUE",
//                 MetricFilterValues: [ // MetricFilterValueList
//                   "STRING_VALUE",
//                 ],
//                 Negate: true || false,
//               },
//             ],
//           },
//           Value: Number("double"),
//         },
//       ],
//     },
//   ],
// };


