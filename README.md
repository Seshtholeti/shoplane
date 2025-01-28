2025-01-28T18:44:50.381Z
INIT_START Runtime Version: nodejs:22.v29 Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f494bf5385768c1a5f722eae90b6dd3d343c96ba7ec22b34f5c819e3e8511722
2025-01-28T18:44:50.642Z
START RequestId: a29531f5-cf62-4812-80b5-11ac3a814160 Version: $LATEST
2025-01-28T18:44:50.646Z
2025-01-28T18:44:50.646Z	a29531f5-cf62-4812-80b5-11ac3a814160	INFO	new {
  resource: '/meta',
  path: '/meta',
  httpMethod: 'POST',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'deflate, gzip',
    'Content-Type': 'application/json',
    'Facebook-API-Version': 'unversioned',
    Host: 'n9hdixucuf.execute-api.us-east-1.amazonaws.com',
    'User-Agent': 'facebookexternalua',
    'X-Amzn-Trace-Id': 'Root=1-679925a2-409c135e6dbc19e4283160ea',
    'X-Forwarded-For': '69.171.234.13',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https',
    'X-Hub-Signature': 'sha1=07176f4a00970d9b011eb741c95882b7d4dcc97b',
    'X-Hub-Signature-256': 'sha256=3511b999d872029da97d4834918456d0c1f9a93e0ad4630fdcf1f1cbcd749e14'
  },
  multiValueHeaders: {
    Accept: [ '*/*' ],
    'Accept-Encoding': [ 'deflate, gzip' ],
    'Content-Type': [ 'application/json' ],
    'Facebook-API-Version': [ 'unversioned' ],
    Host: [ 'n9hdixucuf.execute-api.us-east-1.amazonaws.com' ],
    'User-Agent': [ 'facebookexternalua' ],
    'X-Amzn-Trace-Id': [ 'Root=1-679925a2-409c135e6dbc19e4283160ea' ],
    'X-Forwarded-For': [ '69.171.234.13' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ],
    'X-Hub-Signature': [ 'sha1=07176f4a00970d9b011eb741c95882b7d4dcc97b' ],
    'X-Hub-Signature-256': [
      'sha256=3511b999d872029da97d4834918456d0c1f9a93e0ad4630fdcf1f1cbcd749e14'
    ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: 'mug2qu',
    resourcePath: '/meta',
    httpMethod: 'POST',
    extendedRequestId: 'FHLRYEVtIAMEluA=',
    requestTime: '28/Jan/2025:18:44:50 +0000',
    path: '/dev/meta',
    accountId: '768637739934',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'n9hdixucuf',
    requestTimeEpoch: 1738089890068,
    requestId: 'd11b5eec-4b7d-4ffd-86f6-f32375f7519a',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '69.171.234.13',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'facebookexternalua',
      user: null
    },
    domainName: 'n9hdixucuf.execute-api.us-east-1.amazonaws.com',
    deploymentId: 'skmnxf',
    apiId: 'n9hdixucuf'
  },
  body: '{"object":"instagram","entry":[{"time":1738089889788,"id":"0","messaging":[{"sender":{"id":"12334"},"recipient":{"id":"23245"},"timestamp":233445667,"reaction":{"mid":"random_mid","action":"react","reaction":"love","emoji":"\\u2764\\ufe0f"}}]}]}',
  isBase64Encoded: false
}

2025-01-28T18:44:50.646Z a29531f5-cf62-4812-80b5-11ac3a814160 INFO new { resource: '/meta', path: '/meta', httpMethod: 'POST', headers: { Accept: '*/*', 'Accept-Encoding': 'deflate, gzip', 'Content-Type': 'application/json', 'Facebook-API-Version': 'unversioned', Host: 'n9hdixucuf.execute-api.us-east-1.amazonaws.com', 'User-Agent': 'facebookexternalua', 'X-Amzn-Trace-Id': 'Root=1-679925a2-409c135e6dbc19e4283160ea', 'X-Forwarded-For': '69.171.234.13', 'X-Forwarded-Port': '443', 'X-Forwarded-Proto': 'https', 'X-Hub-Signature': 'sha1=07176f4a00970d9b011eb741c95882b7d4dcc97b', 'X-Hub-Signature-256': 'sha256=3511b999d872029da97d4834918456d0c1f9a93e0ad4630fdcf1f1cbcd749e14' }, multiValueHeaders: { Accept: [ '*/*' ], 'Accept-Encoding': [ 'deflate, gzip' ], 'Content-Type': [ 'application/json' ], 'Facebook-API-Version': [ 'unversioned' ], Host: [ 'n9hdixucuf.execute-api.us-east-1.amazonaws.com' ], 'User-Agent': [ 'facebookexternalua' ], 'X-Amzn-Trace-Id': [ 'Root=1-679925a2-409c135e6dbc19e4283160ea' ], 'X-Forwarded-For': [ '69.171.234.13' ], 'X-Forwarded-Port': [ '443' ], 'X-Forwarded-Proto': [ 'https' ], 'X-Hub-Signature': [ 'sha1=07176f4a00970d9b011eb741c95882b7d4dcc97b' ], 'X-Hub-Signature-256': [ 'sha256=3511b999d872029da97d4834918456d0c1f9a93e0ad4630fdcf1f1cbcd749e14' ] }, queryStringParameters: null, multiValueQueryStringParameters: null, pathParameters: null, stageVariables: null, requestContext: { resourceId: 'mug2qu', resourcePath: '/meta', httpMethod: 'POST', extendedRequestId: 'FHLRYEVtIAMEluA=', requestTime: '28/Jan/2025:18:44:50 +0000', path: '/dev/meta', accountId: '768637739934', protocol: 'HTTP/1.1', stage: 'dev', domainPrefix: 'n9hdixucuf', requestTimeEpoch: 1738089890068, requestId: 'd11b5eec-4b7d-4ffd-86f6-f32375f7519a', identity: { cognitoIdentityPoolId: null, accountId: null, cognitoIdentityId: null, caller: null, sourceIp: '69.171.234.13', principalOrgId: null, accessKey: null, cognitoAuthenticationType: null, cognitoAuthenticationProvider: null, userArn: null, userAgent: 'facebookexternalua', user: null }, domainName: 'n9hdixucuf.execute-api.us-east-1.amazonaws.com', deploymentId: 'skmnxf', apiId: 'n9hdixucuf' }, body: '{"object":"instagram","entry":[{"time":1738089889788,"id":"0","messaging":[{"sender":{"id":"12334"},"recipient":{"id":"23245"},"timestamp":233445667,"reaction":{"mid":"random_mid","action":"react","reaction":"love","emoji":"\\u2764\\ufe0f"}}]}]}', isBase64Encoded: false }
2025-01-28T18:44:50.688Z
2025-01-28T18:44:50.688Z	a29531f5-cf62-4812-80b5-11ac3a814160	ERROR	Error processing webhook: TypeError: Cannot read properties of undefined (reading 'text')
    at Runtime.handler (file:///var/task/index.mjs:43:59)
    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1173:29)



if I clcik on message_reactions I can see the above logs, how ever if I click on messages or comments it is not showing any logs
