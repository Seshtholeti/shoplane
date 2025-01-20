 import fetch from 'node-fetch';
 export const handler = async (event) => {
   try {
       // Parse the incoming event (Instagram message)
       const body = JSON.parse(event.body);
       const entries = body.entry;
       if (!entries || entries.length === 0) {
           return { statusCode: 400, body: 'No entry found' };
       }
       // Process each message
       for (const entry of entries) {
           const messagingEvents = entry.messaging;
           if (!messagingEvents || messagingEvents.length === 0) {
               continue;
           }
           for (const messageEvent of messagingEvents) {
               const senderId = messageEvent.sender.id;
               const messageText = messageEvent.message.text;
               // Log the received message
               console.log(`Received message from ${senderId}: ${messageText}`);
               // Optionally, send a reply back to the Instagram user (via Facebook API)
               await sendMessageToInstagram(senderId, `Thank you for your message: ${messageText}`);
           }
       }
       return { statusCode: 200, body: 'EVENT_RECEIVED' };
   } catch (error) {
       console.error('Error processing webhook:', error);
       return { statusCode: 500, body: 'Internal Server Error' };
   }
};
// Function to send a reply back to the Instagram user (via Facebook API)
async function sendMessageToInstagram(senderId, messageText) {
   const accessToken = 'YOUR_FACEBOOK_PAGE_ACCESS_TOKEN';  // Replace with your access token
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


if I use this lambda and this event 

{
 "body": "{\"object\":\"page\",\"entry\":[{\"id\":\"PAGE_ID\",\"time\":1638745678,\"messaging\":[{\"sender\":{\"id\":\"USER_ID\"},\"recipient\":{\"id\":\"PAGE_ID\"},\"timestamp\":1638745678,\"message\":{\"mid\":\"MESSAGE_ID\",\"text\":\"Hello, I have a question!\"}}]}]}"
}


it gives me this response

Response
{
  "statusCode": 200,
  "body": "EVENT_RECEIVED"
}

Function Logs
START RequestId: fc2f9b41-5617-41a4-9226-6091f2848e92 Version: $LATEST
2025-01-20T10:02:25.844Z	fc2f9b41-5617-41a4-9226-6091f2848e92	INFO	Received message from USER_ID: Hello, I have a question!
2025-01-20T10:02:26.034Z	fc2f9b41-5617-41a4-9226-6091f2848e92	INFO	Message sent to Instagram: {
  error: {
    message: 'Got unexpected null',
    type: 'OAuthException',
    code: 190,
    fbtrace_id: 'Ak6sxi7f5e1uFEFYetDeXLl'
  }
}
