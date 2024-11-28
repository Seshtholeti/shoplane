{
  "statusCode": 500,
  "body": "{\"error\":\"User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\",\"details\":\"AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\\n    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)\\n    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38\\n    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22\\n    at async Runtime.handler (file:///var/task/index.mjs:279:38)\"}"
}

Function Logs
START RequestId: 267a65a7-a505-4bff-b2cd-892da6080f9d Version: $LATEST
2024-11-28T09:02:11.184Z	267a65a7-a505-4bff-b2cd-892da6080f9d	INFO	**** Metric Command ****** {"ResourceArn":"arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21","StartTime":"2024-11-27T00:00:00.000Z","EndTime":"2024-11-27T23:59:59.000Z","Interval":{"IntervalPeriod":"DAY"},"Filters":[{"FilterKey":"QUEUE","FilterValues":["f8c742b9-b5ef-4948-8bbf-9a33c892023f"]}],"Groupings":["QUEUE"],"Metrics":[{"Name":"CONTACTS_HANDLED","Unit":"COUNT"},{"Name":"CONTACTS_ABANDONED","Unit":"COUNT"}]}
2024-11-28T09:02:11.589Z	267a65a7-a505-4bff-b2cd-892da6080f9d	ERROR	Error processing the Lambda function: AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny
    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)
    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18
    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22
    at async Runtime.handler (file:///var/task/index.mjs:279:38) {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 403,
    requestId: 'f1336301-b0eb-41c3-8938-f1c21f948fc0',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
