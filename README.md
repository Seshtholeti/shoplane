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

