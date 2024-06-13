App.js:30 
        
        
       POST https://login.microsoftonline.com/e0e80fc4-4c12-4245-8bfd-c06791ad303a/oauth2/v2.0/token 400 (Bad Request)
sendPostRequestAsync @ FetchClient.ts:77
sendPostRequest @ NetworkManager.ts:60
executePostToTokenEndpoint @ BaseClient.ts:155
(anonymous) @ FunctionWrappers.ts:102
executeTokenRequest @ AuthorizationCodeClient.ts:289
await in executeTokenRequest (async)
(anonymous) @ FunctionWrappers.ts:102
acquireToken @ AuthorizationCodeClient.ts:127
(anonymous) @ FunctionWrappers.ts:102
handleCodeResponseFromServer @ InteractionHandler.ts:148
(anonymous) @ FunctionWrappers.ts:102
handleCodeResponse @ InteractionHandler.ts:85
acquireTokenPopupAsync @ PopupClient.ts:351
await in acquireTokenPopupAsync (async)
acquireToken @ PopupClient.ts:120
acquireTokenPopup @ StandardController.ts:770
loginPopup @ StandardController.ts:1844
loginPopup @ PublicClientApplication.ts:270
onClick @ App.js:30
qe @ react-dom.production.min.js:54
ze @ react-dom.production.min.js:54
(anonymous) @ react-dom.production.min.js:55
Hr @ react-dom.production.min.js:105
Ur @ react-dom.production.min.js:106
(anonymous) @ react-dom.production.min.js:117
ll @ react-dom.production.min.js:273
Me @ react-dom.production.min.js:52
Gr @ react-dom.production.min.js:109
Vt @ react-dom.production.min.js:74
jt @ react-dom.production.min.js:73
Show 27 more frames
Show less
App.js:31 ServerError: invalid_request: 9002326 - [2024-06-13 12:40:10Z]: AADSTS9002326: Cross-origin token redemption is permitted only for the 'Single-Page Application' client-type. Request origin: 'https://d2wg3nbq7bwdfq.cloudfront.net'. Trace ID: 040637cd-1813-4cbb-a44d-e7eb7ebf0e00 Correlation ID: c564421e-c121-4140-b60b-237d5cb5bd76 Timestamp: 2024-06-13 12:40:10Z - Correlation ID: c564421e-c121-4140-b60b-237d5cb5bd76 - Trace ID: 040637cd-1813-4cbb-a44d-e7eb7ebf0e00
    at ts.validateTokenResponse (ResponseHandler.ts:204:33)
    at os.acquireToken (AuthorizationCodeClient.ts:149:25)
    at async As.handleCodeResponseFromServer (InteractionHandler.ts:155:9)
    at async _s.acquireTokenPopupAsync (PopupClient.ts:356:13)
