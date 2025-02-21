{
  "Version": "2019-10-30",
  "StartAction": "611c40d2-41a9-47b5-88c2-9ccbb5b25c21",
  "Metadata": {
    "entryPointPosition": {
      "x": 40,
      "y": 40
    },
    "ActionMetadata": {
      "611c40d2-41a9-47b5-88c2-9ccbb5b25c21": {
        "position": {
          "x": 116,
          "y": 196
        }
      },
      "33a1018d-942e-4253-afe0-5b0326141164": {
        "position": {
          "x": 525.6,
          "y": 260
        }
      },
      "ec8864b8-8596-4351-a7b3-4a872f24cc5f": {
        "position": {
          "x": 668.8,
          "y": 51.2
        }
      },
      "93166a70-8334-47d6-adbe-df6b13bb3954": {
        "position": {
          "x": 252.8,
          "y": 26.4
        },
        "parameters": {
          "Attributes": {
            "customerMessage": {
              "useDynamic": true
            },
            "senderId": {
              "useDynamic": true
            }
          }
        },
        "dynamicParams": [
          "customerMessage",
          "senderId"
        ]
      },
      "c0842f0e-6cbb-4552-881d-8ba216e21931": {
        "position": {
          "x": 453.6,
          "y": 0
        },
        "parameters": {
          "QueueId": {
            "displayName": "Instagram_Support"
          }
        },
        "queue": {
          "text": "Instagram_Support"
        }
      }
    },
    "Annotations": [],
    "name": "Instagram Chat Flow",
    "description": "",
    "type": "contactFlow",
    "status": "PUBLISHED",
    "hash": {}
  },
  "Actions": [
    {
      "Parameters": {
        "FlowLoggingBehavior": "Enabled"
      },
      "Identifier": "611c40d2-41a9-47b5-88c2-9ccbb5b25c21",
      "Type": "UpdateFlowLoggingBehavior",
      "Transitions": {
        "NextAction": "93166a70-8334-47d6-adbe-df6b13bb3954"
      }
    },
    {
      "Parameters": {},
      "Identifier": "33a1018d-942e-4253-afe0-5b0326141164",
      "Type": "DisconnectParticipant",
      "Transitions": {}
    },
    {
      "Parameters": {},
      "Identifier": "ec8864b8-8596-4351-a7b3-4a872f24cc5f",
      "Type": "TransferContactToQueue",
      "Transitions": {
        "NextAction": "33a1018d-942e-4253-afe0-5b0326141164",
        "Errors": [
          {
            "NextAction": "33a1018d-942e-4253-afe0-5b0326141164",
            "ErrorType": "QueueAtCapacity"
          },
          {
            "NextAction": "33a1018d-942e-4253-afe0-5b0326141164",
            "ErrorType": "NoMatchingError"
          }
        ]
      }
    },
    {
      "Parameters": {
        "Attributes": {
          "customerMessage": "$.External.customerMessage",
          "senderId": "$.External.senderId"
        },
        "TargetContact": "Current"
      },
      "Identifier": "93166a70-8334-47d6-adbe-df6b13bb3954",
      "Type": "UpdateContactAttributes",
      "Transitions": {
        "NextAction": "c0842f0e-6cbb-4552-881d-8ba216e21931",
        "Errors": [
          {
            "NextAction": "33a1018d-942e-4253-afe0-5b0326141164",
            "ErrorType": "NoMatchingError"
          }
        ]
      }
    },
    {
      "Parameters": {
        "QueueId": "arn:aws:connect:us-east-1:768637739934:instance/d75ee48a-a107-44fd-a22d-3f77fc7bdd38/queue/ed50cf22-30f8-4716-9a81-605c592d10bb"
      },
      "Identifier": "c0842f0e-6cbb-4552-881d-8ba216e21931",
      "Type": "UpdateContactTargetQueue",
      "Transitions": {
        "NextAction": "ec8864b8-8596-4351-a7b3-4a872f24cc5f",
        "Errors": [
          {
            "NextAction": "33a1018d-942e-4253-afe0-5b0326141164",
            "ErrorType": "NoMatchingError"
          }
        ]
      }
    }
  ]
}

this is the contact flow

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

            const entries = body.entry;

            if (!entries || entries.length === 0) {

                return { statusCode: 400, body: 'No entry found' };

            }

            for (const entry of entries) {

                const messagingEvents = entry.messaging;

                if (messagingEvents && messagingEvents.length > 0) {

                    for (const messageEvent of messagingEvents) {

                        const senderId = messageEvent.sender.id;

                        if (messageEvent.message && messageEvent.message.text) {

                            const messageText = messageEvent.message.text;

                            console.log(`Received message from ${senderId}: ${messageText}`);

                            // ✅ Forward message to Amazon Connect

                            await sendToAmazonConnect(senderId, messageText);

                        }

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

                "InstagramSenderId": senderId,  // Store sender ID for replies

            },

            ParticipantDetails: {

                DisplayName: "Instagram User"

            }

        };

        const response = await connect.startChatContact(params).promise();

        console.log("Chat started in Amazon Connect:", response);

    } catch (error) {

        console.error("Error starting chat in Amazon Connect:", error);

    }

} 
this is the lambda
