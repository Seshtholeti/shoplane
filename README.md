
import { ConnectClient, GetMetricDataV2Command } from "@aws-sdk/client-connect";
import * as storeData  from "./DbConnect.mjs";
const client = new ConnectClient('eu-west-2');

export const handler = async (event,context,callback) => {
  const queue1 = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/2fcc1817-6fb6-477a-be1e-88b5c1d3c98a'
const input = { // GetMetricDataV2Request
  ResourceArn: "arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c", // required
  StartTime: new Date(1715144400 * 1000), // required
  EndTime: new Date(1715166000 * 1000), // required
  // Interval: { // IntervalDetails
  //   // TimeZone: "STRING_VALUE",
  //   IntervalPeriod: "FIFTEEN_MIN" 
  // },
  Filters: [ // FiltersV2List // required
    { // FilterV2
      FilterKey: "QUEUE",
      FilterValues: [ // FilterValueList
        queue1,
      ],
    },
  ],
  // Groupings: [ // GroupingsV2
  //   "QUEUE"
  // ],
 
  Metrics: [
    {
      
      Name: "CONTACTS_HANDLED",
    },
    {
      Name: "MAX_QUEUED_TIME"
    }
  ]
    

 
};

const command = new GetMetricDataV2Command(input);
const response = await client.send(command);
console.log(response)
const response1 = response.MetricResults[0]//{ Collections: [[Object], [Object]] };
const result = response1.Collections
console.log('rr',response1.Collections,typeof(result),response1.Collections.length)

const result1 = {};
result.forEach(item => {
const key = item.Metric.Name;
const value = item.Value;
result1[key] = value;
});
console.log(result1)
console.log('seshu')


let putData = await storeData.runFunction(result1,queue1 );
return putData;


}




import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

async function runFunction(context,queue1){
    let finalData = {};
      console.log('inside ()', context,queue1,context.CONTACTS_HANDLED);

 const tableName = "wb_wallboard_data";
 try {
                     const res =  await dynamo.send(
                      new PutCommand({
                        TableName: tableName,
                         Item: {
         "QueueArn": queue1,
         "CONTACTS_HANDLED": context.CONTACTS_HANDLED || 0, // Provide default value if property is missing
         "MAX_QUEUED_TIME": context.MAX_QUEUED_TIME || 0, // Provide default value if property is missing
       }
                        })
                      );
                      console.log(res)
                    }
                    catch(err) {
                      return new Promise((resolve, reject) => {reject(finalData['data'] = err)});
                    };

}
  


export {
  runFunction
};

















Response
{
  "putData2": null
}

Function Logs
START RequestId: c5003bbe-e365-43fe-8750-ee018e8c1327 Version: $LATEST
2024-05-16T01:21:19.178Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	Metric Results: [ { Collections: [ [Object], [Object] ] } ]
2024-05-16T01:21:19.236Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	[ { Collections: [ [Object], [Object] ] } ]
2024-05-16T01:21:19.236Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	Result 1: [
  { Metric: { Name: 'CONTACTS_HANDLED' }, Value: 1 },
  { Metric: { Name: 'MAX_QUEUED_TIME' }, Value: 13.835 }
]
2024-05-16T01:21:19.237Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	rr [
  { Metric: { Name: 'CONTACTS_HANDLED' }, Value: 1 },
  { Metric: { Name: 'MAX_QUEUED_TIME' }, Value: 13.835 }
] object 2
2024-05-16T01:21:19.237Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	{ Metric: { Name: 'CONTACTS_HANDLED' }, Value: 1 } { Metric: { Name: 'MAX_QUEUED_TIME' }, Value: 13.835 }
2024-05-16T01:21:19.238Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	inside () { CONTACTS_HANDLED: 1, MAX_QUEUED_TIME: 13.835 } arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/2fcc1817-6fb6-477a-be1e-88b5c1d3c98a 1
2024-05-16T01:21:19.420Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	{
  '$metadata': {
    httpStatusCode: 200,
    requestId: '47KG1FU0EV9S333QJ2OMC3H7TVVV4KQNSO5AEMVJF66Q9ASUAAJG',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
2024-05-16T01:21:19.436Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	put Data 1: undefined
2024-05-16T01:21:19.436Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	{ CONTACTS_HANDLED: 1, MAX_QUEUED_TIME: 13.835 }
2024-05-16T01:21:19.437Z	c5003bbe-e365-43fe-8750-ee018e8c1327	INFO	seshu
END RequestId: c5003bbe-e365-43fe-8750-ee018e8c1327
