Response
{
  "statusCode": 500,
  "body": "{\"error\":\"UnknownError\",\"details\":\"DestinationNotAllowedException: UnknownError\\n    at de_DestinationNotAllowedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9873:21)\\n    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9797:19)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38\\n    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22\\n    at async Runtime.handler (file:///var/task/index.mjs:57:27)\"}"
}

Function Logs
START RequestId: d3cc7999-3405-495a-b322-f5aad0a44043 Version: $LATEST
2024-11-20T11:53:05.289Z	d3cc7999-3405-495a-b322-f5aad0a44043	INFO	Row parsed: { Name: 'Mohan', PhoneNumber: '9949921498' }
2024-11-20T11:53:05.289Z	d3cc7999-3405-495a-b322-f5aad0a44043	INFO	PhoneNumber formatted: +919949921498
2024-11-20T11:53:05.321Z	d3cc7999-3405-495a-b322-f5aad0a44043	INFO	Row parsed: { Name: 'Seshu', PhoneNumber: '8639694701' }
2024-11-20T11:53:05.322Z	d3cc7999-3405-495a-b322-f5aad0a44043	INFO	PhoneNumber formatted: +918639694701
2024-11-20T11:53:05.322Z	d3cc7999-3405-495a-b322-f5aad0a44043	INFO	Phone numbers parsed and formatted: [ '+919949921498', '+918639694701' ]
2024-11-20T11:53:05.589Z	d3cc7999-3405-495a-b322-f5aad0a44043	ERROR	Error processing the Lambda function: DestinationNotAllowedException: UnknownError
    at de_DestinationNotAllowedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9873:21)
    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9797:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22
    at async Runtime.handler (file:///var/task/index.mjs:57:27) {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 403,
    requestId: '33c1c06b-c6c3-49ae-a315-aa34cc2b4bb4',
