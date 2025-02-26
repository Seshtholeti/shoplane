import fetch from 'node-fetch';
import AWS from 'aws-sdk';
const VERIFY_TOKEN = "token_123"; 
const CONNECT_INSTANCE_ID = "d75ee48a-a107-44fd-a22d-3f77fc7bdd38";
const CONNECT_CONTACT_FLOW_ID = "937c77e4-f382-4a91-b3d9-43d03b61f741";
const REGION = "us-east-1";  
const connect = new AWS.Connect({ region: REGION });
export const handler = async (event) => {
   console.log('New Event:', JSON.stringify(event, null, 2));
   try {
       if (event.httpMethod === "GET") {
           const queryParams = event.queryStringParameters;
           if (queryParams && queryParams["hub.mode"] === "subscribe" && queryParams["hub.verify_token"] === VERIFY_TOKEN) {
               console.log("Webhook verified successfully");
               return { statusCode: 200, body: queryParams["hub.challenge"] };
           } else {
               console.error("Verification failed");
               return { statusCode: 403, body: "Forbidden" };
           }
       }
       if (event.httpMethod === "POST") {
           const body = JSON.parse(event.body);
           if (!body.entry || body.entry.length === 0) {
               console.error("No entry found in the event body.");
               return { statusCode: 400, body: 'No entry found' };
           }
           for (const entry of body.entry) {
               if (!entry.messaging || entry.messaging.length === 0) {
                   console.warn("No messaging events found in the entry.");
                   continue;
               }
               for (const messageEvent of entry.messaging) {
                   const senderId = messageEvent.sender?.id;
                   const messageText = messageEvent.message?.text;
                   if (senderId && messageText) {
                       console.log(`Received message from ${senderId}: ${messageText}`);
                       await sendToAmazonConnect(senderId, messageText);
                   } else {
                       console.warn("Message event is missing senderId or message text.");
                   }
               }
           }
           return { statusCode: 200, body: 'EVENT_RECEIVED' };
       }
       return { statusCode: 404, body: 'Not Found' };
   } catch (error) {
       console.error("Error processing webhook:", error);
       return { statusCode: 500, body: 'Internal Server Error' };
   }
};
async function sendToAmazonConnect(senderId, messageText) {
   try {
       const params = {
           InstanceId: CONNECT_INSTANCE_ID,
           ContactFlowId: CONNECT_CONTACT_FLOW_ID,
           Attributes: {
               "senderId": senderId,
               "customerMessage": messageText
           },
           ParticipantDetails: {
               DisplayName: "Instagram User"
           },
           InitialMessage: {
               ContentType: "text/plain",
               Content: messageText
           }
       };
       console.log("Starting chat in Amazon Connect with params:", JSON.stringify(params, null, 2));
       const response = await connect.startChatContact(params).promise();
       console.log("Chat started successfully:", response);
   } catch (error) {
       console.error("Error starting chat in Amazon Connect:", error);
   }
}
