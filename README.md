

// Metrics list as per provided requirements
const metrics = [
  { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
  { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
  { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
  { Name: "AGENTS_ONLINE", Unit: "COUNT" },
  { Name: "AGENTS_STAFFED", Unit: "COUNT" },
  { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
  { Name: "AGENTS_ERROR", Unit: "COUNT" },
  { Name: "AGENTS_NON_PRODUCTIVE", Unit: "COUNT" },
  { Name: "AGENTS_ON_CONTACT", Unit: "COUNT" },
  { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
  { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
  { Name: "SLOTS_ACTIVE", Unit: "COUNT" },
  { Name: "SLOTS_AVAILABLE", Unit: "COUNT" }
];

this is the snippet code please refer it:
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

import { ConnectClient, ListPhoneNumbersCommand } from "@aws-sdk/client-connect"; // ES Modules import
// const { ConnectClient, ListPhoneNumbersCommand } = require("@aws-sdk/client-connect"); // CommonJS import
const client = new ConnectClient(config);
const input = { // ListPhoneNumbersRequest
  InstanceId: "STRING_VALUE", // required
  PhoneNumberTypes: [ // PhoneNumberTypes
    "TOLL_FREE" || "DID" || "UIFN" || "SHARED" || "THIRD_PARTY_TF" || "THIRD_PARTY_DID" || "SHORT_CODE",
  ],
  PhoneNumberCountryCodes: [ // PhoneNumberCountryCodes
    "AF" || "AL" || "DZ" || "AS" || "AD" || "AO" || "AI" || "AQ" || "AG" || "AR" || "AM" || "AW" || "AU" || "AT" || "AZ" || "BS" || "BH" || "BD" || "BB" || "BY" || "BE" || "BZ" || "BJ" || "BM" || "BT" || "BO" || "BA" || "BW" || "BR" || "IO" || "VG" || "BN" || "BG" || "BF" || "BI" || "KH" || "CM" || "CA" || "CV" || "KY" || "CF" || "TD" || "CL" || "CN" || "CX" || "CC" || "CO" || "KM" || "CK" || "CR" || "HR" || "CU" || "CW" || "CY" || "CZ" || "CD" || "DK" || "DJ" || "DM" || "DO" || "TL" || "EC" || "EG" || "SV" || "GQ" || "ER" || "EE" || "ET" || "FK" || "FO" || "FJ" || "FI" || "FR" || "PF" || "GA" || "GM" || "GE" || "DE" || "GH" || "GI" || "GR" || "GL" || "GD" || "GU" || "GT" || "GG" || "GN" || "GW" || "GY" || "HT" || "HN" || "HK" || "HU" || "IS" || "IN" || "ID" || "IR" || "IQ" || "IE" || "IM" || "IL" || "IT" || "CI" || "JM" || "JP" || "JE" || "JO" || "KZ" || "KE" || "KI" || "KW" || "KG" || "LA" || "LV" || "LB" || "LS" || "LR" || "LY" || "LI" || "LT" || "LU" || "MO" || "MK" || "MG" || "MW" || "MY" || "MV" || "ML" || "MT" || "MH" || "MR" || "MU" || "YT" || "MX" || "FM" || "MD" || "MC" || "MN" || "ME" || "MS" || "MA" || "MZ" || "MM" || "NA" || "NR" || "NP" || "NL" || "AN" || "NC" || "NZ" || "NI" || "NE" || "NG" || "NU" || "KP" || "MP" || "NO" || "OM" || "PK" || "PW" || "PA" || "PG" || "PY" || "PE" || "PH" || "PN" || "PL" || "PT" || "PR" || "QA" || "CG" || "RE" || "RO" || "RU" || "RW" || "BL" || "SH" || "KN" || "LC" || "MF" || "PM" || "VC" || "WS" || "SM" || "ST" || "SA" || "SN" || "RS" || "SC" || "SL" || "SG" || "SX" || "SK" || "SI" || "SB" || "SO" || "ZA" || "KR" || "ES" || "LK" || "SD" || "SR" || "SJ" || "SZ" || "SE" || "CH" || "SY" || "TW" || "TJ" || "TZ" || "TH" || "TG" || "TK" || "TO" || "TT" || "TN" || "TR" || "TM" || "TC" || "TV" || "VI" || "UG" || "UA" || "AE" || "GB" || "US" || "UY" || "UZ" || "VU" || "VA" || "VE" || "VN" || "WF" || "EH" || "YE" || "ZM" || "ZW",
  ],
  NextToken: "STRING_VALUE",
  MaxResults: Number("int"),
};
const command = new ListPhoneNumbersCommand(input);
const response = await client.send(command);
// { // ListPhoneNumbersResponse
//   PhoneNumberSummaryList: [ // PhoneNumberSummaryList
//     { // PhoneNumberSummary
//       Id: "STRING_VALUE",
//       Arn: "STRING_VALUE",
//       PhoneNumber: "STRING_VALUE",
//       PhoneNumberType: "TOLL_FREE" || "DID" || "UIFN" || "SHARED" || "THIRD_PARTY_TF" || "THIRD_PARTY_DID" || "SHORT_CODE",
//       PhoneNumberCountryCode: "AF" || "AL" || "DZ" || "AS" || "AD" || "AO" || "AI" || "AQ" || "AG" || "AR" || "AM" || "AW" || "AU" || "AT" || "AZ" || "BS" || "BH" || "BD" || "BB" || "BY" || "BE" || "BZ" || "BJ" || "BM" || "BT" || "BO" || "BA" || "BW" || "BR" || "IO" || "VG" || "BN" || "BG" || "BF" || "BI" || "KH" || "CM" || "CA" || "CV" || "KY" || "CF" || "TD" || "CL" || "CN" || "CX" || "CC" || "CO" || "KM" || "CK" || "CR" || "HR" || "CU" || "CW" || "CY" || "CZ" || "CD" || "DK" || "DJ" || "DM" || "DO" || "TL" || "EC" || "EG" || "SV" || "GQ" || "ER" || "EE" || "ET" || "FK" || "FO" || "FJ" || "FI" || "FR" || "PF" || "GA" || "GM" || "GE" || "DE" || "GH" || "GI" || "GR" || "GL" || "GD" || "GU" || "GT" || "GG" || "GN" || "GW" || "GY" || "HT" || "HN" || "HK" || "HU" || "IS" || "IN" || "ID" || "IR" || "IQ" || "IE" || "IM" || "IL" || "IT" || "CI" || "JM" || "JP" || "JE" || "JO" || "KZ" || "KE" || "KI" || "KW" || "KG" || "LA" || "LV" || "LB" || "LS" || "LR" || "LY" || "LI" || "LT" || "LU" || "MO" || "MK" || "MG" || "MW" || "MY" || "MV" || "ML" || "MT" || "MH" || "MR" || "MU" || "YT" || "MX" || "FM" || "MD" || "MC" || "MN" || "ME" || "MS" || "MA" || "MZ" || "MM" || "NA" || "NR" || "NP" || "NL" || "AN" || "NC" || "NZ" || "NI" || "NE" || "NG" || "NU" || "KP" || "MP" || "NO" || "OM" || "PK" || "PW" || "PA" || "PG" || "PY" || "PE" || "PH" || "PN" || "PL" || "PT" || "PR" || "QA" || "CG" || "RE" || "RO" || "RU" || "RW" || "BL" || "SH" || "KN" || "LC" || "MF" || "PM" || "VC" || "WS" || "SM" || "ST" || "SA" || "SN" || "RS" || "SC" || "SL" || "SG" || "SX" || "SK" || "SI" || "SB" || "SO" || "ZA" || "KR" || "ES" || "LK" || "SD" || "SR" || "SJ" || "SZ" || "SE" || "CH" || "SY" || "TW" || "TJ" || "TZ" || "TH" || "TG" || "TK" || "TO" || "TT" || "TN" || "TR" || "TM" || "TC" || "TV" || "VI" || "UG" || "UA" || "AE" || "GB" || "US" || "UY" || "UZ" || "VU" || "VA" || "VE" || "VN" || "WF" || "EH" || "YE" || "ZM" || "ZW",
//     },
//   ],
//   NextToken: "STRING_VALUE",
// };

similarly for agents
