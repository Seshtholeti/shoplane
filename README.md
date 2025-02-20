2025-02-20T06:22:48.983Z
2025-02-20T06:22:48.983Z	88fd9c80-6a3c-42fe-9ad9-9df5a1fdf87f	INFO	Received message from 1089888002823180: Hiiii

2025-02-20T06:22:48.983Z 88fd9c80-6a3c-42fe-9ad9-9df5a1fdf87f INFO Received message from 1089888002823180: Hiiii
2025-02-20T06:22:49.522Z
2025-02-20T06:22:49.522Z	88fd9c80-6a3c-42fe-9ad9-9df5a1fdf87f	ERROR	Error starting chat in Amazon Connect: AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/amazonConnectWithInstagram-role-i7bkfqtk/amazonConnectWithInstagram is not authorized to perform: connect:StartChatContact on resource: arn:aws:connect:us-east-1:768637739934:instance/d75ee48a-a107-44fd-a22d-3f77fc7bdd38/contact-flow/arn%3Aaws%3Aconnect%3Aus-east-1%3A768637739934%3Ainstance%2Fd75ee48a-a107-44fd-a22d-3f77fc7bdd38%2Fcontact-flow%2F937c77e4-f382-4a91-b3d9-43d03b61f741
    at Object.extractError (/opt/node_modules/aws-sdk/lib/protocol/json.js:80:27)
    at Request.extractError (/opt/node_modules/aws-sdk/lib/protocol/rest_json.js:62:8)
    at Request.callListeners (/opt/node_modules/aws-sdk/lib/sequential_executor.js:106:20)
    at Request.emit (/opt/node_modules/aws-sdk/lib/sequential_executor.js:78:10)
    at Request.emit (/opt/node_modules/aws-sdk/lib/request.js:686:14)
    at Request.transition (/opt/node_modules/aws-sdk/lib/request.js:22:10)
    at AcceptorStateMachine.runTo (/opt/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at /opt/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (/opt/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (/opt/node_modules/aws-sdk/lib/request.js:688:12) {
  code: 'AccessDeniedException',
  time: 2025-02-20T06:22:49.521Z,
  requestId: 'a3b8ee15-bbba-4574-af37-1e9eaf311b92',
  statusCode: 403,
  retryable: false,
  retryDelay: 59.871116878782196
}
