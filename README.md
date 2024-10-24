import { ConnectClient, ListQueuesCommand } from "@aws-sdk/client-connect"; // ES Modules import
// const { ConnectClient, ListQueuesCommand } = require("@aws-sdk/client-connect"); // CommonJS import
const client = new ConnectClient(config);
const input = { // ListQueuesRequest
  InstanceId: "STRING_VALUE", // required
  QueueTypes: [ // QueueTypes
    "STANDARD" || "AGENT",
  ],
  NextToken: "STRING_VALUE",
  MaxResults: Number("int"),
};
const command = new ListQueuesCommand(input);
const response = await client.send(command);
// { // ListQueuesResponse
//   QueueSummaryList: [ // QueueSummaryList
//     { // QueueSummary
//       Id: "STRING_VALUE",
//       Arn: "STRING_VALUE",
//       Name: "STRING_VALUE",
//       QueueType: "STANDARD" || "AGENT",
//       LastModifiedTime: new Date("TIMESTAMP"),
//       LastModifiedRegion: "STRING_VALUE",
//     },
//   ],
//   NextToken: "STRING_VALUE",
// };

