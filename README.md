Status: Succeeded
Test Event Name: test

Response:
{
  "statusCode": 200,
  "body": "EVENT_RECEIVED"
}

Function Logs:
START RequestId: 38c8ee02-d1b2-41b1-bc84-0009c7f3ec30 Version: $LATEST
2025-03-03T11:19:22.291Z	38c8ee02-d1b2-41b1-bc84-0009c7f3ec30	INFO	New Event: {
  "httpMethod": "POST",
  "body": "{\"entry\":[{\"messaging\":[{\"sender\":{\"id\":\"123456\"},\"message\":{\"text\":\"Hello!\"}}]}]}"
}
2025-03-03T11:19:22.291Z	38c8ee02-d1b2-41b1-bc84-0009c7f3ec30	INFO	Received message from 123456: Hello!
2025-03-03T11:19:22.632Z	38c8ee02-d1b2-41b1-bc84-0009c7f3ec30	ERROR	Error storing chat history: ResourceNotFoundException: Requested resource not found
    at Request.extractError (/opt/node_modules/aws-sdk/lib/protocol/json.js:80:27)
    at Request.callListeners (/opt/node_modules/aws-sdk/lib/sequential_executor.js:106:20)
    at Request.emit (/opt/node_modules/aws-sdk/lib/sequential_executor.js:78:10)
    at Request.emit (/opt/node_modules/aws-sdk/lib/request.js:686:14)
    at Request.transition (/opt/node_modules/aws-sdk/lib/request.js:22:10)
    at AcceptorStateMachine.runTo (/opt/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at /opt/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (/opt/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (/opt/node_modules/aws-sdk/lib/request.js:688:12)
    at Request.callListeners (/opt/node_modules/aws-sdk/lib/sequential_executor.js:116:18) {
  code: 'ResourceNotFoundException',
  '[__type]': 'See error.__type for details.',
  time: 2025-03-03T11:19:22.632Z,
  requestId: 'PB5CHS6L46COUURBTKK9JLRALNVV4KQNSO5AEMVJF66Q9ASUAAJG',
  statusCode: 400,
  retryable: false,
  retryDelay: 45.41562120434054
}
2025-03-03T11:19:22.632Z	38c8ee02-d1b2-41b1-bc84-0009c7f3ec30	INFO	Starting chat in Amazon Connect with params: {
  "InstanceId": "d75ee48a-a107-44fd-a22d-3f77fc7bdd38",
  "ContactFlowId": "937c77e4-f382-4a91-b3d9-43d03b61f741",
  "Attributes": {
    "senderId": "123456",
    "customerMessage": "Hello!"
  },
  "ParticipantDetails": {
    "DisplayName": "Instagram User"
  },
  "InitialMessage": {
    "ContentType": "text/plain",
    "Content": "Hello!"
  }
}
2025-03-03T11:19:23.392Z	38c8ee02-d1b2-41b1-bc84-0009c7f3ec30	INFO	Chat started successfully: {
  ContactId: 'f213b98a-60a3-4204-bd28-6065cb210a0a',
  ParticipantId: 'b3219aef-9c76-4315-bd42-f200e8b4371f',
  ParticipantToken: 'QVFJREFIai85aHQ4cWtvTUxMa0hadm1TS3lKMTY4V0RPeUZMQW9EREZISDZBUUd6TWdFUjg0WW5ZaFRsc2w5c29sQ0ZrNUFXQUFBQWJqQnNCZ2txaGtpRzl3MEJCd2FnWHpCZEFnRUFNRmdHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFNbmR4T1VxQmZUTUl1TmVNRkFnRVFnQ3VvUWhvYVVJZXg2VFBUUTZiQ2c0NHhwRFU0VWVFa1ZFN3RWengxcU40bFFKSCsxMGlqdE9TQ1dTN0Y6OmRKM01oYUxRU2ZNWEdMZmdobHp3WVBZaTMwUXN0eVBUeVdwQ0Nva1BCQkhWYVVMWlM1M2w3RHI2QkhOdjlCK1R1Y3FyWGNpaVVYaUc5RmN2d2lrS3djQVpvK0NIWEIraGNOUnJBRTJFMzU4NlpacnpjZlNmeFdPdks5V0FWY1lWZlJCeVNzSlc0S0p3K0RMNWRlMlRqUDVqdXVTNmhqN0dZY203eGFrYUxURkNzWWtNSkZUZkZ3WTkrZUZqNGlLcTVaQkQxdVBpeWdVWUFLUGVKeGYvemJOeU9DNCt5RzNzeFVVdzRZZ1RJMGkzbStvNm0zUDQ=',
  ContinuedFromContactId: null
}
END RequestId: 38c8ee02-d1b2-41b1-bc84-0009c7f3ec30
REPORT RequestId: 38c8ee02-d1b2-41b1-bc84-0009c7f3ec30	Duration: 1575.72 ms	Billed Duration: 1576 ms	Memory Size: 128 MB	Max Memory Used: 102 MB

Request ID: 38c8ee02-d1b2-41b1-bc84-0009c7f3ec30
