2025-01-23T09:03:56.334Z	1be8a860-88f7-4457-a35e-12a8e41767b5	INFO	Received message: "Hello!" from user USER_ID


2025-01-23T09:03:56.454Z	1be8a860-88f7-4457-a35e-12a8e41767b5	ERROR	Unhandled Promise Rejection 	{
    "errorType": "Runtime.UnhandledPromiseRejection",
    "errorMessage": "ReferenceError: PAGE_ACCESS_TOKEN is not defined",
    "reason": {
        "errorType": "ReferenceError",
        "errorMessage": "PAGE_ACCESS_TOKEN is not defined",
        "stack": [
            "ReferenceError: PAGE_ACCESS_TOKEN is not defined",
            "    at sendReplyToUser (file:///var/task/index.mjs:128:77)",
            "    at file:///var/task/index.mjs:114:26",
            "    at Array.forEach (<anonymous>)",
            "    at file:///var/task/index.mjs:109:25",
            "    at Array.forEach (<anonymous>)",
            "    at Runtime.handler (file:///var/task/index.mjs:106:23)",
            "    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1173:29)"
        ]
    },
    "promise": {},
    "stack": [
        "Runtime.UnhandledPromiseRejection: ReferenceError: PAGE_ACCESS_TOKEN is not defined",
        "    at process.<anonymous> (file:///var/runtime/index.mjs:1276:17)",
        "    at process.emit (node:events:518:28)",
        "    at emitUnhandledRejection (node:internal/process/promises:252:13)",
        "    at throwUnhandledRejectionsMode (node:internal/process/promises:388:19)",
        "    at processPromiseRejections (node:internal/process/promises:475:17)",
        "    at process.processTicksAndRejections (node:internal/process/task_queues:106:32)"
    ]
}


[ERROR] [1737623036474] LAMBDA_RUNTIME Failed to post handler success response. Http response code: 403.


lambda code

import fetch from 'node-fetch';
export const handler = async (event) => {
   const VERIFY_TOKEN = "token_123"; 
   const PAGE_ACCESS_TOKEN = "EAAX8zKLRFn8BO4NcgAnFzaHkFQq116F0JY1cMzJSMyeo8IRmglZBbP4TxwEmGqvprQmZCkg8JKSaylI2o066YYUaFxOntbeHChZCO4D3hAPBHQgMZA5YZCzzwUItHWCaG6u0sRF9HmKVsAC31gsFSHNIZB93ZAJBx4DhTjTNW3HygQwma0eeYEa914HLnRHCwEVKgZDZD"; 
   // Handle GET Request (Webhook Validation)
   if (event.httpMethod === "GET") {
       const params = event.queryStringParameters;
       if (params["hub.mode"] === "subscribe" && params["hub.verify_token"] === VERIFY_TOKEN) {
           return {
               statusCode: 200,
               body: params["hub.challenge"], // Return the challenge value
           };
       }
       return { statusCode: 403, body: "Forbidden - Validation Failed" }; // Invalid token or mode
   }
   // Handle POST Request (Incoming Events)
   if (event.httpMethod === "POST") {
       const body = JSON.parse(event.body);
       if (body.object === "page") {
           // Process each entry in the event
           body.entry.forEach((entry) => {
               const messages = entry.messaging;
               // Handle each message
               messages.forEach(async (messageEvent) => {
                   const senderId = messageEvent.sender.id; // User ID
                   const messageText = messageEvent.message?.text || ""; // Received text message
                   console.log(`Received message: "${messageText}" from user ${senderId}`);
                   // Example: Send a reply to the user
                   await sendReplyToUser(senderId, `You sent: "${messageText}"`);
               });
           });
           return {
               statusCode: 200,
               body: "EVENT_RECEIVED", // Meta expects this exact response
           };
       }
       return { statusCode: 404, body: "Unsupported Event Type" };
   }
   return { statusCode: 404, body: "Unsupported HTTP Method" };
};
// Function to Send a Reply to the User
async function sendReplyToUser(senderId, message) {
   const url = `https://graph.facebook.com/v16.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
   const body = {
       recipient: { id: senderId },
       message: { text: message },
   };
   try {
       const response = await fetch(url, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(body),
       });
       const data = await response.json();
       console.log("Reply sent successfully:", data);
   } catch (error) {
       console.error("Error sending reply:", error);
   }
}
