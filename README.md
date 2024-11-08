{
  "errorType": "AccessDeniedException",
  "errorMessage": "User: arn:aws:sts::768637739934:assumed-role/metricdata-for-all-levels-role-1trvfars/metricdata-for-all-levels is not authorized to perform: connect:* on resource: * with an explicit deny",
  "trace": [
    "AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/metricdata-for-all-levels-role-1trvfars/metricdata-for-all-levels is not authorized to perform: connect:* on resource: * with an explicit deny",
    "    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)",
    "    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)",
    "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)",
    "    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20",
    "    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18",
    "    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38",
    "    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22",
    "    at async getHistoricalMetrics (file:///var/task/index.mjs:102:22)",
    "    at async Runtime.handler (file:///var/task/index.mjs:115:35)"
  ]
}
