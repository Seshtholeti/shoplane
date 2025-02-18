import fetch from 'node-fetch';
export const handler = async (event) => {
 const VERIFY_TOKEN = "token_123";
//  console.log('New Event:', event);
console.log('New Event:', JSON.stringify(event, null, 2));
 try {
   // Handle GET request for webhook verification
   if (event.httpMethod === "GET") {
     const queryParams = event.queryStringParameters;
     if (
       queryParams &&
       queryParams["hub.mode"] === "subscribe" &&
       queryParams["hub.verify_token"] === VERIFY_TOKEN
     ) {
       console.log("Webhook verified successfully");
       return {
         statusCode: 200,
         body: queryParams["hub.challenge"],  // Respond with the challenge
       };
     } else {
       console.error("Verification failed");
       return {
         statusCode: 403,
         body: "Forbidden",
       };
     }
   }
   // Handle POST request for receiving messages, comments, and reactions
   if (event.httpMethod === "POST") {
     const body = JSON.parse(event.body);
     const entries = body.entry;
     // Check if the entries are valid
     if (!entries || entries.length === 0) {
       return { statusCode: 400, body: 'No entry found' };
     }
     for (const entry of entries) {
       // Handle messaging events
       const messagingEvents = entry.messaging;
       if (messagingEvents && messagingEvents.length > 0) {
         for (const messageEvent of messagingEvents) {
           const senderId = messageEvent.sender.id;
           // If it's a message
           if (messageEvent.messages && messageEvent.messages.text) {
             const messageText = messageEvent.messages.text;
             console.log(`Received message from ${senderId}: ${messageText}`);
             await sendMessageToInstagram(senderId, `Thank you for your message: ${messageText}`);
           }
           // If it's a reaction
           else if (messageEvent.reaction) {
             const reaction = messageEvent.reaction.reaction;
             console.log(`Received reaction from ${senderId}: ${reaction}`);
           }
         }
       }
       // Handle comment events
       const changes = entry.changes;
       if (changes && changes.length > 0) {
         for (const change of changes) {
           if (change.field === "comments") {
             const commentMessage = change.value.message;
             console.log(`Received comment: ${commentMessage}`);
           }
         }
       }
     }
     // Return success response
     return { statusCode: 200, body: 'EVENT_RECEIVED' };
   }
   // If the HTTP method is not GET or POST, return a 404 error
   return { statusCode: 404, body: 'KMHVC' };
 } catch (error) {
   console.error("Error processing webhook:", error);
   return { statusCode: 500, body: 'Internal Server Error' };
 }
};
// Function to send a reply back to the Instagram user (via Facebook API)
async function sendMessageToInstagram(senderId, messageText) {
 const accessToken = "EAAX8zKLRFn8BO4NcgAnFzaHkFQq116F0JY1cMzJSMyeo8IRmglZBbP4TxwEmGqvprQmZCkg8JKSaylI2o066YYUaFxOntbeHChZCO4D3hAPBHQgMZA5YZCzzwUItHWCaG6u0sRF9HmKVsAC31gsFSHNIZB93ZAJBx4DhTjTNW3HygQwma0eeYEa914HLnRHCwEVKgZDZD";  // Replace with your access token
 const url = `https://graph.facebook.com/v12.0/me/messages?access_token=${accessToken}`;
 const requestBody = {
   recipient: { id: senderId },
   message: { text: messageText }
 };
 try {
   const response = await fetch(url, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(requestBody)
   });
   const result = await response.json();
   console.log('Message sent to Instagram:', result);
 } catch (error) {
   console.error('Error sending message to Instagram:', error);
 }
}

this is the code.

   "body": "{\"object\":\"instagram\",\"entry\":[{\"time\":1739524134853,\"id\":\"17841401165135019\",\"messaging\":[{\"sender\":{\"id\":\"1089888002823180\"},\"recipient\":{\"id\":\"17841401165135019\"},\"timestamp\":1739524134531,\"message\":{\"mid\":\"aWdfZAG1faXRlbToxOklHTWVzc2FnZAUlEOjE3ODQxNDAxMTY1MTM1MDE5OjM0MDI4MjM2Njg0MTcxMDMwMTI0NDI1OTY1MzU3NDEyMzk2ODEyNDozMjA4ODU1NjUxOTczNDgxMTUzMzYyNzg3MjkzMzU3NjcwNAZDZD\",\"text\":\"Hi , I need an assistance\"}}]}]}",
    "isBase64Encoded": false
}

this is the response in cloudwatch logs
