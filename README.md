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


async function getQueryMetrics(){
  
    const currentTime = new Date();
    const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;
    const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
    
    var unixStartTimestamp = Math.floor(startTime.getTime()/1000);
    console.log("unixTimestamp", unixStartTimestamp);
    
    const endTime = new Date(startTime.getTime() - (120 * 60 * 1000));
    var unixEndTimestamp = Math.floor(endTime.getTime()/1000);
    console.log("End time", unixEndTimestamp);
   
var DE_Queries_English = process.env.DE_Queries_English;
var DE_Queries_German = process.env.DE_Queries_German;
  var params = { 
      ResourceArn: process.env.ResourceArn,
      StartTime:unixEndTimestamp,
      EndTime: unixStartTimestamp, 
      
      Filters: [ 
          {
          FilterKey: "QUEUE",
          FilterValues: [DE_Queries_English, DE_Queries_German],
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


async function getReservationMetrics(){
  
    const currentTime = new Date();
    const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;
    const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
    
    var unixStartTimestamp = Math.floor(startTime.getTime()/1000);
    console.log("unixTimestamp", unixStartTimestamp);
    
    const endTime = new Date(startTime.getTime() - (120 * 60 * 1000));
    var unixEndTimestamp = Math.floor(endTime.getTime()/1000);
    console.log("End time", unixEndTimestamp);
   
    var Queue_Reservation_German = process.env.Queue_Reservation_German;
    var Queue_Reservation_English = process.env.Queue_Reservation_English;

  var params = { 
      ResourceArn: process.env.ResourceArn,
      StartTime:unixEndTimestamp,
      EndTime: unixStartTimestamp, 
      
      Filters: [ 
          {
          FilterKey: "QUEUE",
          FilterValues: [Queue_Reservation_German, Queue_Reservation_English],
        },
      ],
     // Groupings: [ "QUEUE"],
     
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


async function getGroupCurrentMetrics(){
  
  var DE_Group_English =process.env.DE_Group_English;
  var DE_Group_German = process.env.DE_Group_English;

const params = { // GetCurrentMetricDataRequest
  InstanceId: process.env.ResourceArn, // required
  Filters: { // Filters
     Queues: [ // Queues
     DE_Group_English,DE_Group_German
     ],
    
    
    Channels: [ // Channels
      "VOICE",
    ],
  },
  CurrentMetrics: [ // CurrentMetrics // required
    { // CurrentMetric
      Name: "AGENTS_ONLINE",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_ON_CALL",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "CONTACTS_IN_QUEUE",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_STAFFED",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_AVAILABLE",
      Unit: "COUNT",
    },
  ],
  MaxResults: Number("2"),
};


  const data = await connect.getCurrentMetricData(params).promise();
  console.log(JSON.stringify(data)); 
  
  return data;
}


async function getQueryCurrentMetrics(){
  
  var DE_Queries_English = process.env.DE_Queries_English;
  var DE_Queries_German = process.env.DE_Queries_German;

const params = { // GetCurrentMetricDataRequest
  InstanceId: process.env.ResourceArn,
  Filters: { // Filters
     Queues: [ // Queues
     DE_Queries_English,DE_Queries_German
     ],
    
    Channels: [ // Channels
      "VOICE",
    ],
  },
  CurrentMetrics: [ // CurrentMetrics // required
    { // CurrentMetric
      Name: "AGENTS_ONLINE",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_ON_CALL",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "CONTACTS_IN_QUEUE",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_STAFFED",
      Unit: "COUNT",
    },
        { // CurrentMetric
      Name: "AGENTS_AVAILABLE",
      Unit: "COUNT",
    },
  ],
  MaxResults: Number("2"),
};


  const data = await connect.getCurrentMetricData(params).promise();
  console.log(JSON.stringify(data)); 
  
  return data;
}



async function getReservationCurrentMetrics() {
  
  var Queue_Reservation_German = process.env.Queue_Reservation_German;
  var Queue_Reservation_English = process.env.Queue_Reservation_English;

  const params = { // GetCurrentMetricDataRequest
  InstanceId: process.env.ResourceArn,
  Filters: { // Filters
    Queues: [ // Queues
     Queue_Reservation_German, Queue_Reservation_English
     ],
    
    
    Channels: [ // Channels
      "VOICE",
    ],
  },
  CurrentMetrics: [ // CurrentMetrics // required
    { // CurrentMetric
      Name: "AGENTS_ONLINE",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_ON_CALL",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "CONTACTS_IN_QUEUE",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_STAFFED",
      Unit: "COUNT",
    },
    { // CurrentMetric
      Name: "AGENTS_AVAILABLE",
      Unit: "COUNT",
    },
  ],
  MaxResults: Number("2"),
};


  const data = await connect.getCurrentMetricData(params).promise();
  console.log(JSON.stringify(data)); 
  
  return data;
}


module.exports = {
  getReservationMetrics,
  getQueryMetrics,
  getGroupMetrics,
  getReservationCurrentMetrics,
  getGroupCurrentMetrics,
  getQueryCurrentMetrics,
};
