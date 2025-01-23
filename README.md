

import fetch from 'node-fetch';
export const handler = async (event) => {
  const VERIFY_TOKEN = "token_123";
  console.log('new',event) 
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
      // Handle POST request for receiving messages
      if (event.httpMethod === "POST") {
          const body = JSON.parse(event.body);
          const entries = body.entry;
          // Check if the entries are valid
          if (!entries || entries.length === 0) {
              return { statusCode: 400, body: 'No entry found' };
          }
          
          for (const entry of entries) {
              const messagingEvents = entry.messaging;
              if (!messagingEvents || messagingEvents.length === 0) {
                  continue;
              }
              // Process each messaging event (received message)
              for (const messageEvent of messagingEvents) {
                  const senderId = messageEvent.sender.id;
                  const messageText = messageEvent.message.text;
                  // Logging the received message
                  console.log(`Received message from ${senderId}: ${messageText}`);
                  // sending a reply back to the Instagram user (via Facebook API)
                  await sendMessageToInstagram(senderId, `Thank you for your message: ${messageText}`);
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
  const accessToken = 'EAAX8zKLRFn8BO4NcgAnFzaHkFQq116F0JY1cMzJSMyeo8IRmglZBbP4TxwEmGqvprQmZCkg8JKSaylI2o066YYUaFxOntbeHChZCO4D3hAPBHQgMZA5YZCzzwUItHWCaG6u0sRF9HmKVsAC31gsFSHNIZB93ZAJBx4DhTjTNW3HygQwma0eeYEa914HLnRHCwEVKgZDZD';  // Replace with your access token
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


Response:
{
  "statusCode": 200,
  "body": "challenge_string"
}

Function Logs:
START RequestId: 96d744cb-a098-49bb-bf1f-bfd21a49ea3f Version: $LATEST
2025-01-23T07:05:20.346Z	96d744cb-a098-49bb-bf1f-bfd21a49ea3f	INFO	new {
  httpMethod: 'GET',
  queryStringParameters: {
    'hub.mode': 'subscribe',
    'hub.verify_token': 'token_123',
    'hub.challenge': 'challenge_string'
  }
}


this is the api https://n9hdixucuf.execute-api.us-east-1.amazonaws.com/dev/meta

however when I paste this url in webhooks of meta it says url not validated, however if I click on verify section my lambda and api are getting triggered by sending empty events



2025-01-22T10:48:44.629Z
START RequestId: 3131e4a3-53cb-4ba3-a15e-1d43dffc1882 Version: $LATEST

START RequestId: 3131e4a3-53cb-4ba3-a15e-1d43dffc1882 Version: $LATEST
2025-01-22T10:48:44.630Z
2025-01-22T10:48:44.630Z	3131e4a3-53cb-4ba3-a15e-1d43dffc1882	INFO	new 
{}


2025-01-22T10:48:44.630Z 3131e4a3-53cb-4ba3-a15e-1d43dffc1882 INFO new {}
2025-01-22T10:48:44.631Z
END RequestId: 3131e4a3-53cb-4ba3-a15e-1d43dffc1882

END RequestId: 3131e4a3-53cb-4ba3-a15e-1d43dffc1882
2025-01-22T10:48:44.631Z
REPORT RequestId: 3131e4a3-53cb-4ba3-a15e-1d43dffc1882	Duration: 1.57 ms	Billed Duration: 2 ms	Memory Size: 128 MB	Max Memory Used: 86 MB



