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

