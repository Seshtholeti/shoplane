const AWS = require("aws-sdk");
var connect = new AWS.Connect({apiVersion: '2017-08-08'});
//console.log(connect)

/*
* function to retrieve metrics data from Amazon connect
*/

async function getGuestRelationMetrics(){
  
    const currentTime = new Date();
    const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;
    const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
    
    var unixStartTimestamp = Math.floor(startTime.getTime()/1000);
    console.log("unixTimestamp", unixStartTimestamp);
    
    const endTime = new Date(startTime.getTime() - (120 * 60 * 1000));
    var unixEndTimestamp = Math.floor(endTime.getTime()/1000);
    console.log("End time", unixEndTimestamp);
   
  var queue_quest = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/622d63ce-cac6-4a26-999a-9727fc800452';
  var queue_Restaurant = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/811b33e6-8fdc-43a8-95e8-66081b14271c';
  var queue_Loyalty_Beefeater = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/7b3b6611-7393-41be-ac81-1d8324130cc0';
  var queue_Loyalty_Brewers_Fayre = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/fd80dc69-55ec-4726-b95f-eb1bcd3a078e';
  var queue_Loyalty_Table = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/1c89515d-c166-4830-a210-95f89a073da4';
  
  var params = { 
      ResourceArn: "arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c", // required
      StartTime:unixEndTimestamp,
      EndTime: unixStartTimestamp, 
      
      Filters: [ 
          {
          FilterKey: "QUEUE",
          FilterValues: [queue_quest, queue_Restaurant, queue_Loyalty_Beefeater, queue_Loyalty_Brewers_Fayre, queue_Loyalty_Table ],
        },
      ],
     // Groupings: [ "QUEUE"],
     
      Metrics: [
        {
          Name: "AGENT_ANSWER_RATE",
        },
        {
          Name: "CONTACTS_HANDLED"
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
   
  var Queue_Amendment = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/6066eb97-f085-4b63-9441-127ffde06b45';
  var Queue_Booking = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/c06443d9-4ec7-455c-9d6e-e9d52883659d';
  var Queue_Cancellation = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/6890ac96-fd88-4f30-bc65-b628b9943b8d';
  var Queue_hub_Res_Centre = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/685f0f28-9121-418b-bc05-3e90a026b270';
  var Queue_Site_Support = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/03253ff3-74bc-41b5-b9c2-8c1804a90ff7';
  var Queue_Pi_Accessible = 'arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c/queue/14da9f44-be0f-45f5-a3e2-030569515e0e';
  
  var params = { 
      ResourceArn: "arn:aws:connect:eu-west-2:879634695871:instance/f01f9b30-5eb9-4744-8dd2-3baa9b68285c", // required
      StartTime:unixEndTimestamp,
      EndTime: unixStartTimestamp, 
      
      Filters: [ 
          {
          FilterKey: "QUEUE",
          FilterValues: [Queue_Amendment, Queue_Booking, Queue_Cancellation, Queue_hub_Res_Centre, Queue_Site_Support, Queue_Pi_Accessible ],
        },
      ],
     // Groupings: [ "QUEUE"],
     
      Metrics: [
        {
          Name: "AGENT_ANSWER_RATE",
        },
        {
          Name: "CONTACTS_HANDLED"
        }
        
      ]
    };

  const data = await connect.getMetricDataV2(params).promise();
  console.log(JSON.stringify(data)); 
  
  return data;
}






module.exports = {
  getGuestRelationMetrics,
  getReservationMetrics
};



this is my util.js


const utils = require('./utils');
exports.handler = async (event) => {
// let formattedResponse = {};
 let GuestMetrics = await utils.getGuestRelationMetrics();
 
 let ReservationMetrics = await utils.getReservationMetrics();
 
 
 //let metrics_data = await utils.getHistoricalMetricsDataReservation();
 
 //console.log("Response", JSON.stringify(metrics_data));
//  return formattedResponse;
};


this is my index.js we are using Node.js 16.x







import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

async function runFunction(context){
    let finalData = {};
    let agentNotReady = 0;
    console.log("context is: ",context);
      if (context.MetricResults.length > 0) {
        for(let [index,wallBoardIndex] of context.MetricResults.entries()) {
                    let wallBoardData = {};
                    console.log("wallboard index: ",wallBoardIndex)
                    wallBoardIndex.Collections.forEach((data)=> {
                        console.log(`Metric data for record `, data);
                        wallBoardData[data.Metric.Name] = data.Value;
                        console.log("data: ",data)
                    });

      }
      } else {
        return new Promise((resolve, reject) => {resolve(finalData['data'] = 'NO RECORDS FETCH')});
      }
};



export {
  runFunction
};
