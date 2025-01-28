2025-01-28T18:36:53.412Z	9a66a86a-c622-4f62-860a-5ea2c0b9958f	INFO	new {
  resource: '/meta',
  path: '/meta',
  httpMethod: 'POST',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    Host: 'n9hdixucuf.execute-api.us-east-1.amazonaws.com',
    'Postman-Token': '47e300d9-59ac-4e91-9352-2965f2c86494',
    'User-Agent': 'PostmanRuntime/7.43.0',
    'X-Amzn-Trace-Id': 'Root=1-679923c4-0a3e0fd32144ddef1eb997ef',
    'X-Forwarded-For': '54.86.50.139',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    Accept: [ '*/*' ],
    'Accept-Encoding': [ 'gzip, deflate, br' ],
    'Cache-Control': [ 'no-cache' ],
    'Content-Type': [ 'application/json' ],
    Host: [ 'n9hdixucuf.execute-api.us-east-1.amazonaws.com' ],
    'Postman-Token': [ '47e300d9-59ac-4e91-9352-2965f2c86494' ],
    'User-Agent': [ 'PostmanRuntime/7.43.0' ],
    'X-Amzn-Trace-Id': [ 'Root=1-679923c4-0a3e0fd32144ddef1eb997ef' ],
    'X-Forwarded-For': [ '54.86.50.139' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: 'mug2qu',
    resourcePath: '/meta',
    httpMethod: 'POST',
    extendedRequestId: 'FHKGzHTGIAMEU6g=',
    requestTime: '28/Jan/2025:18:36:52 +0000',
    path: '/dev/meta',
    accountId: '768637739934',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'n9hdixucuf',
    requestTimeEpoch: 1738089412761,
    requestId: 'f8107aec-9f8a-48a0-b6c2-7a4bfc572f7d',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '54.86.50.139',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'PostmanRuntime/7.43.0',
      user: null
    },
    domainName: 'n9hdixucuf.execute-api.us-east-1.amazonaws.com',
    deploymentId: 'skmnxf',
    apiId: 'n9hdixucuf'
  },
  body: '{\r\n' +
    ' "object": "instagram",\r\n' +
    ' "entry": [\r\n' +
    '   {\r\n' +
    '     "id": "123456789",\r\n' +
    '     "time": 1629309596,\r\n' +
    '     "changes": [\r\n' +
    '       {\r\n' +
    '         "field": "messages",\r\n' +
    '         "value": {\r\n' +
    '           "sender": {\r\n' +
    '             "id": "user-id"\r\n' +
    '           },\r\n' +
    '           "recipient": {\r\n' +
    '             "id": "page-id"\r\n' +
    '           },\r\n' +
    '           "message": {\r\n' +
    '             "text": "Hello World"\r\n' +
    '           }\r\n' +
    '         }\r\n' +
    '       }\r\n' +
    '     ]\r\n' +
    '   }\r\n' +
    ' ]\r\n' +
    '}',
  isBase64Encoded: false
}
