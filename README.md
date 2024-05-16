
import { ConnectClient, GetMetricDataV2Command } from "@aws-sdk/client-connect";
import * as storeData  from "./DbConnect.mjs";
const client = new ConnectClient('eu-west-2');

export const handler = async (event,context,callback) => {
  const queue1 = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/2fcc1817-6fb6-477a-be1e-88b5c1d3c98a'
  const queue2 = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/240b0ef7-708f-40fa-bf87-1c1f7b458906'
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
        queue1,queue2
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
// console.log(response, response.MetricResults.length)
let putData2 = null;
let putData1 = null;

 
if(response && response.MetricResults && response.MetricResults.length>0){
console.log("Metric Results:",response.MetricResults); //Logging metric results
const response1 = response.MetricResults[0]//{ Collections: [[Object], [Object]] };
console.log(response.MetricResults)
const result = response1.Collections
console.log("Result 1:",result) //Logging result 1
console.log('rr',response1.Collections,typeof(result),response1.Collections.length)
console.log(result[0],result[1])
const result1 = {};
result.forEach(item => {
const key = item.Metric.Name;
const value = item.Value;
result1[key] = value;
});

putData1 = await storeData.runFunction(result1,queue1 );
console.log("put Data 1:", putData1) ; //Logging put Data 1

console.log(result1);
console.log('seshu');



if(response.MetricResults.length>1){

const response2 = response.MetricResults[1]//{ Collections: [[Object], [Object]] };
const result2 = response2.Collections
console.log("Result 2:", result2)   //logging result2
console.log('check',response1.Collections,typeof(result),response1.Collections.length)

const result2Data = {};
result2.forEach(item => {
const key = item.Metric.Name;
const value = item.Value;
result2Data[key] = value;
});






putData2 = await storeData.runFunction(result2Data,queue2 );
console.log("put Data 2:", putData2) ;  //Logging put Data 2

}
}
return {putData1,putData2};


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



 

 
    
