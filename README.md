import AWS from 'aws-sdk';

import fetch from 'node-fetch';

const VERIFY_TOKEN = "token_123";

const CONNECT_INSTANCE_ID = "your-connect-instance-id";  

const CONTACT_FLOW_ID = "your-contact-flow-id"; 

const REGION = "us-east-1";  

const PAGE_ACCESS_TOKEN = "EAAFvByAHUHEBO58A0T8UdgSWAG9P9lJFkZBZAaUeK8o8KZCYkPv9qHZCVCirlf24Vh2ZBnajEKRui1J1pPVHPUgqUDxPapMZABnzHmUrP6eNHZBsuPMTlCpWLVru8XZAGSINyaDU2nspNMEZCIXrumd3FLpNitBReCvVKFuGT2s4O2BJcOTCxc1fZByZBvz38EYNGD0sqxjp01I6WkN2x30kR6WYGEntzAZD";  // Replace with your valid Meta access token

const connect = new AWS.Connect({ region: REGION });

export const handler = async (event) => {

    console.log('New Event:', JSON.stringify(event, null, 2));

    try {

        if (event.httpMethod === "GET") {

            const queryParams = event.queryStringParameters;

            if (queryParams &&

                queryParams["hub.mode"] === "subscribe" &&

                queryParams["hub.verify_token"] === VERIFY_TOKEN) {

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

                return { statusCode: 400, body: "No entry found" };

            }

            for (const entry of body.entry) {

                const messagingEvents = entry.messaging;

                if (messagingEvents && messagingEvents.length > 0) {

                    for (const messageEvent of messagingEvents) {

                        const senderId = messageEvent.sender.id;

                        // Handle text messages

                        if (messageEvent.message && messageEvent.message.text) {

                            const messageText = messageEvent.message.text;

                            console.log(`Received message from ${senderId}: ${messageText}`);

                            // Start a chat contact in Amazon Connect

                            await startChatContact(senderId, messageText);

                        }

                        // Handle reactions

                        else if (messageEvent.reaction) {

                            const reaction = messageEvent.reaction.reaction;

                            console.log(`Received reaction from ${senderId}: ${reaction}`);

                        }

                    }

                }

            }

            return { statusCode: 200, body: "EVENT_RECEIVED" };

        }

        return { statusCode: 404, body: "Not Found" };

    } catch (error) {

        console.error("Error processing webhook:", error);

        return { statusCode: 500, body: "Internal Server Error" };

    }

};

// Function to start a chat in Amazon Connect

async function startChatContact(senderId, messageText) {

    const params = {

        InstanceId: CONNECT_INSTANCE_ID,

        ContactFlowId: CONTACT_FLOW_ID,

        ParticipantDetails: { DisplayName: `IG_${senderId}` },

        Attributes: { senderId: senderId }

    };

    try {

        const data = await connect.startChatContact(params).promise();

        console.log('Chat started in Amazon Connect:', data);

    } catch (error) {

        console.error('Error starting chat in Amazon Connect:', error);

    }

}

// Function to send agent replies back to Instagram

async function sendMessageToInstagram(senderId, messageText) {

    const url = `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

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

