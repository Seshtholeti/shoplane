import fetch from 'node-fetch';
export const handler = async (event) => {
  const VERIFY_TOKEN = "token_123";
  try {
      // Handle GET request for webhook verification
      if (event.httpMethod === "GET") {
          const queryParams = event.queryStringParameters;
          // Verify the token sent by Meta for webhook validation
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
          // Process each message
          for (const entry of entries) {
              const messagingEvents = entry.messaging;
              if (!messagingEvents || messagingEvents.length === 0) {
                  continue;
              }
              // Process each messaging event (received message)
              for (const messageEvent of messagingEvents) {
                  const senderId = messageEvent.sender.id;
                  const messageText = messageEvent.message.text;
                  // Log the received message
                  console.log(`Received message from ${senderId}: ${messageText}`);
                  // Optionally, send a reply back to the Instagram user (via Facebook API)
                  await sendMessageToInstagram(senderId, `Thank you for your message: ${messageText}`);
              }
          }
          // Return success response
          return { statusCode: 200, body: 'EVENT_RECEIVED' };
      }
      // If the HTTP method is not GET or POST, return a 404 error
      return { statusCode: 404, body: 'Unsupported HTTP Method' };
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

this is the lambda

this is the config test events

{
  "httpMethod": "GET",
  "queryStringParameters": {
    "hub.mode": "subscribe",
    "hub.verify_token": "token_123",
    "hub.challenge": "challenge_string"
  }
}

https://run4xxdsu5.execute-api.us-east-1.amazonaws.com/test

this is the api

when I search this api in the browser it gives  {"message":"Missing Authentication Token"}


and in the meta account when I place this in the webhooks it says url not validated http 403 forbidden error
