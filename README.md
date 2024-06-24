const AWS = require("aws-sdk");
var connect = new AWS.Connect({apiVersion: '2017-08-08'});
//console.log(connect)

/*
* function to retrieve metrics data from Amazon connect
*/

async function getGroupMetrics(){
  
    const currentTime = new Date();
    const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;
    const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
    
    var unixStartTimestamp = Math.floor(startTime.getTime()/1000);
    console.log("unixTimestamp", unixStartTimestamp);
    
    const endTime = new Date(startTime.getTime() - (120 * 60 * 1000));
    var unixEndTimestamp = Math.floor(endTime.getTime()/1000);
    console.log("End time", unixEndTimestamp);
   
var DE_Group_English =process.env.DE_Group_English;
var DE_Group_German = process.env.DE_Group_English;
var params = { 
      ResourceArn:process.env.ResourceArn,
      StartTime:unixEndTimestamp,
      EndTime: unixStartTimestamp, 
      
      Filters: [ 
          {
          FilterKey: "QUEUE",
          FilterValues: [DE_Group_English, DE_Group_German],
        },
      ],
      Metrics: [
        {
          Name: "AGENT_ANSWER_RATE",
        },
        {
          Name: "CONTACTS_HANDLED"
        },
        {
          Name: "MAX_QUEUED_TIME"
        },
        {
          Name: "SUM_CONTACTS_ANSWERED_IN_X",
          Threshold: [{
            Comparison: "LT",
            ThresholdValue: 7200
          }]
        }
      ]
    };

  const data = await connect.getMetricDataV2(params).promise();
  console.log(JSON.stringify(data)); 
  
  return data;
}
const data = await connect.getCurrentMetricData(params).promise();
  console.log(JSON.stringify(data)); 
  
  return data;
}

module.exports = {
 getGroupMetrics
 }


 above is the refernce code, modify my code which is below according to that.
const AWS = require("aws-sdk");
var connect = new AWS.Connect({apiVersion: '2017-08-08'}); // CommonJS import

const config = {
 region: 'us-east-1',
};
const client = new ConnectClient(config);
const input = { // GetMetricDataV2Request
 ResourceArn: "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21", // required
 StartTime: new Date("2023-06-24T00:00:00Z"), // required
 EndTime: new Date("2023-06-24T23:59:59Z"), // required
 Interval: { // IntervalDetails
   TimeZone: "UTC",
   IntervalPeriod: "FIFTEEN_MIN", 
 },
 Filters: [ // FiltersV2List // required
   { // FilterV2
     FilterKey: "Queue",
     FilterValues: [ "ASTRO Internet Queue", "ASTRO Streaming Queue"
       
     ],
   },
 ],

 Metrics: [ // MetricsV2 // required
   { // MetricV2
     Name: "CONTACTS_HANDLED",
   },
   { 
     Name: "AGENT_ANSWER_RATE",
   },
   {
     Name: "MAX_QUEUED_TIME",
   },
   {
          Name: "SUM_CONTACTS_ANSWERED_IN_X",
          Threshold: [{
            Comparison: "LT",
            ThresholdValue: 7200
          }]
        }
 ],
 
};
const getMetrics = async () => {
 try {
   const command = new GetMetricDataV2Command(input);
   const response = await client.send(command);
   console.log(response);
 } catch (error) {
   console.error(error);
 }
};
getMetrics();
