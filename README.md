
import { ConnectClient, GetMetricDataV2Command } from "@aws-sdk/client-connect";
import * as storeData  from "./DbConnect.mjs";
const client = new ConnectClient('eu-west-2');

export const handler = async (event,context,callback) => {
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
        "arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/2fcc1817-6fb6-477a-be1e-88b5c1d3c98a",
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
let putData = await storeData.runFunction(result);
return putData;


}

// const decodedData = event.records.map(record => Buffer.from(record.data,'base64').toString('utf-8'));
    
//     // console.log('decodedData:',decodedData);
    
//   /* decodedData.forEach((data, index)=> {
//         console.log(`Decoded data for record ${index}`, data);
//     });*/
//     const output = event.records.map((record) => ({
//         recordId: record.recordId,
//         result: 'Ok',
//         data: record.data,
//     }));
//     // console.log('output : ',output);
//     console.log(`Processing completed.  Successful records ${output.length}.`);
//     const records = {};
//     // records['decodeOutput'] = output;
//     records['response'] = response;
//     let putData = await storeData.runFunction(records);
//     return records ;


// };



 

 
    
