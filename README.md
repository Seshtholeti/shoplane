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
   const accessToken = 'FACEBOOK_PAGE_ACCESS_TOKEN';  
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
