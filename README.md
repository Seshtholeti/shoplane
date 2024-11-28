Response
{
  "statusCode": 500,
  "body": "{\"error\":\"User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\",\"details\":\"AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\\n    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)\\n    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38\\n    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22\\n    at async Runtime.handler (file:///var/task/index.mjs:280:38)\"}"
}

Function Logs
START RequestId: 92fb3a37-4365-48f5-9785-8a7258a6269c Version: $LATEST
2024-11-28T07:04:06.690Z	92fb3a37-4365-48f5-9785-8a7258a6269c	ERROR	Error processing the Lambda function: AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny
    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)
    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22
    at async Runtime.handler (file:///var/task/index.mjs:280:38) {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 403,
    requestId: '79839a74-060c-41e6-a411-eb5ce07887d2',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
END RequestId: 92fb3a37-4365-48f5-9785-8a7258a6269c
REPORT RequestId: 92fb3a37-4365-48f5-9785-8a7258a6269c	Duration: 2082.09 ms	Billed Duration: 2083 ms	Memory Size: 128 MB	Max Memory Used: 107 MB	Init Duration: 716.80 ms

Request ID
92fb3a37-4365-48f5-9785-8a7258a6269c
