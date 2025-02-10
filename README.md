import fetch from 'node-fetch';
export const handler = async (event) => {
 const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
 console.log('New Event:', event);
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
         body: queryParams["hub.challenge"], // Respond with the challenge
       };
     } else {
       console.error("Verification failed");
       return {
         statusCode: 403,
         body: "Forbidden",
       };
     }
   }
   // Handle POST request for receiving messages (Facebook Messenger Only)
   if (event.httpMethod === "POST") {
     const body = JSON.parse(event.body);
     const entries = body.entry;
     if (!entries || entries.length === 0) {
       return { statusCode: 400, body: 'No entry found' };
     }
     for (const entry of entries) {
       const messaging = entry.messaging;
       if (messaging && messaging.length > 0) {
         for (const messageEvent of messaging) {
           if (messageEvent.message && messageEvent.sender) {
             const senderId = messageEvent.sender.id;
             const messageText = messageEvent.message.text || "No text message";
             console.log(`Received message from ${senderId}: ${messageText}`);
             // Send reply message
             await sendMessageToFacebook(senderId, `Thank you for your message: ${messageText}`);
           }
         }
       }
     }
     // Return success response
     return { statusCode: 200, body: 'EVENT_RECEIVED' };
   }
   // If the HTTP method is not GET or POST, return a 404 error
   return { statusCode: 404, body: 'Not Found' };
 } catch (error) {
   console.error("Error processing webhook:", error);
   return { statusCode: 500, body: 'Internal Server Error' };
 }
};
// Function to send a reply back to the Facebook user
async function sendMessageToFacebook(senderId, messageText) {
 const accessToken = process.env.ACCESS_TOKEN;  // Use environment variable for security
 const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${accessToken}`;
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
   console.log('Message sent to Facebook:', result);
 } catch (error) {
   console.error('Error sending message to Facebook:', error);
 }


Status: Failed
Test Event Name: (unsaved) test event

Response:
{
  "errorType": "Runtime.UserCodeSyntaxError",
  "errorMessage": "SyntaxError: Unexpected end of input",
  "trace": [
    "Runtime.UserCodeSyntaxError: SyntaxError: Unexpected end of input",
    "    at _loadUserApp (file:///var/runtime/index.mjs:1084:17)",
    "    at async UserFunction.js.module.exports.load (file:///var/runtime/index.mjs:1119:21)",
    "    at async start (file:///var/runtime/index.mjs:1282:23)",
    "    at async file:///var/runtime/index.mjs:1288:1"
  ]
}

Function Logs:
2025-02-10T07:37:10.463Z	undefined	ERROR	Uncaught Exception 	{"errorType":"Runtime.UserCodeSyntaxError","errorMessage":"SyntaxError: Unexpected end of input","stack":["Runtime.UserCodeSyntaxError: SyntaxError: Unexpected end of input","    at _loadUserApp (file:///var/runtime/index.mjs:1084:17)","    at async UserFunction.js.module.exports.load (file:///var/runtime/index.mjs:1119:21)","    at async start (file:///var/runtime/index.mjs:1282:23)","    at async file:///var/runtime/index.mjs:1288:1"]}
INIT_REPORT Init Duration: 150.79 ms	Phase: init	Status: error	Error Type: Runtime.UserCodeSyntaxError
2025-02-10T07:37:11.523Z	undefined	ERROR	Uncaught Exception 	{"errorType":"Runtime.UserCodeSyntaxError","errorMessage":"SyntaxError: Unexpected end of input","stack":["Runtime.UserCodeSyntaxError: SyntaxError: Unexpected end of input","    at _loadUserApp (file:///var/runtime/index.mjs:1084:17)","    at async UserFunction.js.module.exports.load (file:///var/runtime/index.mjs:1119:21)","    at async start (file:///var/runtime/index.mjs:1282:23)","    at async file:///var/runtime/index.mjs:1288:1"]}
INIT_REPORT Init Duration: 1329.49 ms	Phase: invoke	Status: error	Error Type: Runtime.UserCodeSyntaxError
START RequestId: f8400400-dd9e-4025-b644-4c78df3287c7 Version: $LATEST
END RequestId: f8400400-dd9e-4025-b644-4c78df3287c7
REPORT RequestId: f8400400-dd9e-4025-b644-4c78df3287c7	Duration: 1338.34 ms	Billed Duration: 1339 ms	Memory Size: 128 MB	Max Memory Used: 71 MB	Status: error	Error Type: Runtime.UserCodeSyntaxError

Request ID: f8400400-dd9e-4025-b644-4c78df3287c7



