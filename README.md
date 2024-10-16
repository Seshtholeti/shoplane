Voice-To-Chat Solution Module Documentation
Overview
This CloudFormation template is designed to deploy a Voice-To-Chat solution. The solution enables deflection from a voice call to a chat channel using AWS services like Amazon Connect, Lambda, Pinpoint, and S3.
Features
	•	Integration of Lambda Function: Sends SMS notifications to mobile numbers.
	•	Contact Flow Module: Deflects voice calls to chat.
	•	SMS Notification Capability: Utilizes AWS Pinpoint for messaging.
	•	Logging and Monitoring: Captures function executions via Amazon CloudWatch.
	•	Chat Bot UI Deployment: Utilizes S3 and CloudFront for hosting.
Prerequisites
Before deploying the CloudFormation template, ensure that the following prerequisites are met:
	1.	Amazon Connect Instance ARN: You will need to provide the ARN of an existing Amazon Connect instance where the contact flow will be deployed.
	2.	Public Key: Required for CloudFront configuration.
	3.	Private Key: Required for CloudFront configuration.
	4.	Pinpoint Toll-Free Number: Ensure you have a toll-free number with SMS capabilities enabled in AWS Pinpoint.
Parameters
Required Parameters:
	•	ConnectInstanceArn: ARN of the Amazon Connect instance.
	•	ConnectModuleName: The name of the Connect contact flow module (default: VoiceToChatFlow).
	•	LambdaFunctionName: The name of the Lambda function handling the voice-to-chat transfer (default: MyLambdaFunction).
	•	PrivateKey: Key for Private Key.
	•	PublicKeyId: Key ID for Public Key.
Resources and Their Functionality
Step 1: Create Lambda Function for Voice-to-Chat Transfer
	•	Resource Type: `AWS::Lambda::Function`
	•	Properties:
	•	FunctionName: Set to the value of `LambdaFunctionName` parameter (default: `MyLambdaFunction`).
	•	Handler: The entry point for the Lambda function, set to `lambda_function.lambda_handler`.
	•	Role: Assigned using the ARN of the `LambdaExecutionRole` created in Step 2.
	•	Code:
	•	S3Bucket: Points to `voice-to-chat-lambda-solution`.
	•	S3Key: The code package (`newVoicetochat.zip`) is stored in S3.
	•	Runtime: Set to Python 3.10.
	•	Timeout: Set to 15 seconds.
	•	Environment Variables:
	•	`applicationId`: References the Pinpoint application created later.
	•	`domainName`: Obtained from the CloudFront distribution created later.
	•	`privateKey`: Passed from the template parameters.
	•	`publicKeyId`: Passed from the template parameters.
Step 2: Create Lambda Execution Role
	•	Resource Type: `AWS::IAM::Role`
	•	Properties:
	•	AssumeRolePolicyDocument: Allows AWS Lambda to assume this role.
	•	Policies:
	•	Grants permissions for logging (`logs:*`), S3 access (`s3:GetObject`), Amazon Connect actions (`connect:*`), and AWS Pinpoint actions (`pinpoint:*`).
Step 3: Create Amazon Connect Integration Association
	•	Resource Type: `AWS::Connect::IntegrationAssociation`
	•	Properties:
	•	InstanceId: References the ARN of the Amazon Connect instance provided in the parameters.
	•	IntegrationType: Set to `LAMBDA_FUNCTION`.
	•	IntegrationArn: References the ARN of the Lambda function created in Step 1.
Step 4: Create Amazon Connect Contact Flow Module
	•	Resource Type: `AWS::Connect::ContactFlowModule`
	•	Properties:
	•	InstanceArn: References the ARN of the Amazon Connect instance.
	•	Name: Uses the value of `ConnectModuleName` parameter (default: `VoiceToChatFlow`).
	•	Content: Defines a JSON structure that outlines how calls are handled, including:
	•	Starting actions, message participants, invoking Lambda functions, and managing participant inputs.
	•	The flow allows customers to choose between receiving a chat link via email or SMS.
Step 5: Create AWS Pinpoint Application
	•	Resource Type: `AWS::Pinpoint::App`
	•	Properties:
	•	Name: Set to `VoiceToChatApp`, which will manage communications.
Step 6: Create AWS Pinpoint SMS Channel
	•	Resource Type: `AWS::Pinpoint::SMSChannel`
	•	Properties:
	•	ApplicationId: References the Pinpoint application created in Step 5.
	•	Enabled: Set to true, enabling SMS capabilities.
Step 7: Create S3 Bucket for UI
	•	Resource Type: `AWS::S3::Bucket`
	•	Properties:
	•	BucketName: Set to a unique name (e.g., `voicetochatcft`) for storing UI files.
Step 8: Create CloudFront Public Key
	•	Resource Type: `AWS::CloudFront::PublicKey`
	•	Properties:
	•	Defines a public key configuration for CloudFront, allowing secure access to resources.
Step 9: Create CloudFront Key Group
	•	Resource Type: `AWS::CloudFront::KeyGroup`
	•	Properties:
	•	Defines a key group using the public key created in Step 8.
Step 10: Create CloudFront Origin Access Control
	•	Resource Type: `AWS::CloudFront::OriginAccessControl`
	•	Properties:
	•	Configures access control for securely accessing S3 bucket content through CloudFront.
Step 11: Create CloudFront Distribution
	•	Resource Type: `AWS::CloudFront::Distribution`
	•	Properties:
	•	Configures distribution settings, including origins (the S3 bucket), cache behavior, and security settings using key groups.
How the Solution Works
	1.	Voice Call Initialization: When a customer initiates a voice call, the Amazon Connect contact flow triggers if no agent is available, offering a chat option.
	2.	Lambda Invocation: Based on customer input, the Lambda function sends an SMS with a chat link using Pinpoint.
	3.	Chat Link Delivery: The customer receives a link redirecting them to a chat channel.
	4.	Call Disconnection: The voice call ends, allowing continued conversation via chat.
Logging and Monitoring
The solution integrates with CloudWatch Logs to capture Lambda execution details and ensure all errors and performance metrics are logged. Additionally, Amazon Connect logging for contact flow executions is enabled.
Conclusion
This solution enables a seamless transition from voice communication to chat, enhancing customer experience while leveraging AWS services like Lambda, Connect, and Pinpoint. By following this documentation, you can successfully deploy and configure your Voice-To-Chat solution module.