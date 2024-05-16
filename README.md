Response
{
  "putData1": {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "EGM7TOJ93HUKFGFJN66TSSE8MVVV4KQNSO5AEMVJF66Q9ASUAAJG",
      "attempts": 1,
      "totalRetryDelay": 0
    }
  },
  "putData2": null
}

Function Logs
START RequestId: 46ebf70f-bac3-4e3f-aeff-33b5e92bc43b Version: $LATEST
2024-05-16T13:37:18.208Z	46ebf70f-bac3-4e3f-aeff-33b5e92bc43b	INFO	Response for queue1: { Collections: [] }
2024-05-16T13:37:18.266Z	46ebf70f-bac3-4e3f-aeff-33b5e92bc43b	INFO	Context for queue1: { CONTACTS_HANDLED: undefined, MAX_QUEUED_TIME: undefined }
2024-05-16T13:37:18.266Z	46ebf70f-bac3-4e3f-aeff-33b5e92bc43b	INFO	inside () { CONTACTS_HANDLED: undefined, MAX_QUEUED_TIME: undefined } arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/2fcc1817-6fb6-477a-be1e-88b5c1d3c98a undefined
2024-05-16T13:37:18.427Z	46ebf70f-bac3-4e3f-aeff-33b5e92bc43b	INFO	{
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'EGM7TOJ93HUKFGFJN66TSSE8MVVV4KQNSO5AEMVJF66Q9ASUAAJG',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
2024-05-16T13:37:18.427Z	46ebf70f-bac3-4e3f-aeff-33b5e92bc43b	INFO	putData1: {
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'EGM7TOJ93HUKFGFJN66TSSE8MVVV4KQNSO5AEMVJF66Q9ASUAAJG',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
2024-05-16T13:37:18.466Z	46ebf70f-bac3-4e3f-aeff-33b5e92bc43b	INFO	putData2: null
END RequestId: 46ebf70f-bac3-4e3f-aeff-33b5e92bc43b
REPORT RequestId: 46ebf70f-bac3-4e3f-aeff-33b5e92bc43b	Duration: 1038.50 ms	Billed Duration: 1039 ms	Memory Size: 128 MB	Max Memory Used: 105 MB	Init Duration: 523.76 ms






import { ConnectClient, GetMetricDataCommand } from "@aws-sdk/client-connect";
import * as storeData from "./DbConnect.mjs";
export const handler = async (event, context, callback) => {
 const queue1 = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/2fcc1817-6fb6-477a-be1e-88b5c1d3c98a';
 const queue2 = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/240b0ef7-708f-40fa-bf87-1c1f7b458906';
 const client = new ConnectClient('eu-west-2');
 // Round the current time to the nearest multiple of 5
 const currentTime = new Date();
 const roundedMinutes = Math.round(currentTime.getMinutes() / 5) * 5;
 const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
 // Ensure end time is after start time and is a multiple of 5 minutes
 const endTime = new Date(startTime.getTime() + (5 * 60 * 1000)); // Add 5 minutes
 
 const input = {
   InstanceId: "arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c",
   StartTime: startTime,
   EndTime: endTime,
   Filters: {
     Queues: [queue1, queue2]
   },
   HistoricalMetrics: [
     {
       Name: "CONTACTS_HANDLED",
       Statistic: "SUM",
       Unit: "COUNT"
     },
     {
       Name: "QUEUED_TIME",
       Statistic: "MAX",
       Unit: "SECONDS"
     }
   ]
 };
 const command = new GetMetricDataCommand(input);
 const response = await client.send(command);
 let putData1 = null;
 let putData2 = null;
 if (response && response.MetricResults && response.MetricResults.length > 0) {
   const result1 = response.MetricResults[0].Collections.reduce((acc, item) => {
     acc[item.Metric.Name] = item.Value;
     return acc;
   }, {});
   putData1 = await storeData.runFunction(result1, queue1);
   if (response.MetricResults.length > 1) {
     const result2 = response.MetricResults[1].Collections.reduce((acc, item) => {
       acc[item.Metric.Name] = item.Value;
       return acc;
     }, {});
     putData2 = await storeData.runFunction(result2, queue2);
   }
 }
 return { putData1, putData2 };
};

above one is index.mjs


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

async function runFunction(context,queue){
    let finalData = {};
      console.log('inside ()', context,queue,context.CONTACTS_HANDLED);

 const tableName = "wb_wallboard_data";
 try {
                     const res =  await dynamo.send(
                      new PutCommand({
                        TableName: tableName,
                         Item: {
         "QueueArn": queue,
         "CONTACTS_HANDLED": context.CONTACTS_HANDLED || 0, // Provide default value if property is missing
         "MAX_QUEUED_TIME": context.MAX_QUEUED_TIME || 0, // Provide default value if property is missing
       }
                        })
                      );
                      console.log(res)
                      
                      return res;
                    }
                    catch(err) {
                    //   return new Promise((resolve, reject) => {reject(finalData['data'] = err)});
                    
                    console.error("error in q2:", err);
                    
                    return null;
                    };

}



  


export {
  runFunction
};

above one is dbconnect.mjs any changes to be made with resoect to index.mjs?
