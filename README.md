{
  "statusCode": 500,
  "body": "{\"error\":\"User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\",\"details\":\"AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\\n    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)\\n    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38\\n    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22\\n    at async Runtime.handler (file:///var/task/index.mjs:201:38)\"}"
}

Function Logs
START RequestId: 47f15fcc-3053-4b23-924b-7edc763eb4d5 Version: $LATEST
2024-11-22T10:53:15.321Z	47f15fcc-3053-4b23-924b-7edc763eb4d5	ERROR	Error processing the Lambda function: AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny
    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)
    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22
    at async Runtime.handler (file:///var/task/index.mjs:201:38) {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 403,
    requestId: 'a3c7ea47-8547-4a0b-af19-aab600dc5ed2',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
