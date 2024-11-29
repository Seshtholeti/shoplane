Test Event Name
MyEventName

Response
{
  "errorType": "Runtime.UserCodeSyntaxError",
  "errorMessage": "SyntaxError: Named export 'SearchContactRecordsCommand' not found. The requested module '@aws-sdk/client-connect' is a CommonJS module, which may not support all module.exports as named exports.\nCommonJS modules can always be imported via the default export, for example using:\n\nimport pkg from '@aws-sdk/client-connect';\nconst { ConnectClient, SearchContactRecordsCommand } = pkg;\n",
  "trace": [
    "Runtime.UserCodeSyntaxError: SyntaxError: Named export 'SearchContactRecordsCommand' not found. The requested module '@aws-sdk/client-connect' is a CommonJS module, which may not support all module.exports as named exports.",
    "CommonJS modules can always be imported via the default export, for example using:",
    "",
    "import pkg from '@aws-sdk/client-connect';",
    "const { ConnectClient, SearchContactRecordsCommand } = pkg;",
    "",
    "    at _loadUserApp (file:///var/runtime/index.mjs:1084:17)",
    "    at async UserFunction.js.module.exports.load (file:///var/runtime/index.mjs:1119:21)",
    "    at async start (file:///var/runtime/index.mjs:1282:23)",
    "    at async file:///var/runtime/index.mjs:1288:1"
  ]
}
