Voice-To-Chat Solution Module Documentation

 Overview
 This CloudFormation template is designed to deploy a Voice-To-Chat solution. The solution enables deflection from a voice call to a chat channel using AWS services like Amazon Connect, Lambda, Pinpoint, and S3.

Features:
 • Integration of Lambda function in connect flow to send sms to mobile number
 • Contact Flow Module for deflecting voice calls to chat.
 • SMS notification capability using AWS Pinpoint.
 • Logging and monitoring of function executions via Amazon CloudWatch.
 • Deploy the Chat bot UI using S3 and CloudFront.

Prerequisites
Before deploying the CloudFormation template, ensure that the following prerequisites are met:
1. Amazon Connect Instance ARN: You will need to provide the ARN of an existing Amazon Connect instance where the contact flow will be deployed.
2. S3 Bucket: Ensure you have an S3 bucket for storing Lambda code packages.
3. IAM Role: A role with necessary permissions for Lambda, Connect, and Pinpoint services should be available or created.
4. In pinpoint we need to have a tollfree number with SMS enabled to send SMS

 Parameters
 Required Parameters:
ConnectInstanceArn: ARN of the Amazon Connect instance.
ConnectModuleName: The name of the Connect contact flow module (default: VoiceToChatFlow).
LambdaFunctionName: The name of the Lambda function handling the voice-to-chat transfer (default: MyLambdaFunction).
privateKey: Key for Private Key.
publicKeyId: Key ID for Public Key.

Resources
1. Lambda Function for Voice-to-Chat Transfer :  A Lambda function is created to handle the voice-to-chat deflection by invoking the necessary logic to trigger chat or voice communication.
 • Environment Variables:
 • applicationId: Application ID of the Pinpoint App.
 • domainName: Domain name from cloud distribution.
 • privateKey: The Lambda function is associated with an execution role allowing access to AWS Connect, S3, and Pinpoint services.
 • publicKeyId: Domain name from cloud distribution.
 
2. Amazon Connect Contact Flow Module
 This resource defines a Contact Flow Module that allows voice interactions to transition to chat within Amazon Connect. The module will utilize Lambda to handle customer inputs and provide an option to send an SMS with a chatbot link.
 • Key Actions:
 • The contact flow sends messages to participants.
 • Invokes the Lambda function to process inputs.
 • Offers options for customers to choose between email or SMS for receiving the chat link.
 
3. AWS Pinpoint Integration
 AWS Pinpoint is used to send chat links via email and SMS:
 • Pinpoint App: A Pinpoint app is created to handle communication.

4. S3 and CloudFront Configuration
 S3 and CloudFront are used for hosting Lambda code and serving the Contact Flow Module through a highly available content delivery network.


How the Solution Works
1. Voice Call Initialization: When a customer initiates a voice call, the Amazon Connect contact flow triggers the voice-to-chat solution if no agent is available for call it will provide chat option.
2. Lambda Invocation: Based on the customer’s choice, the Lambda function processes the input and sends a link via SMS using Pinpoint.
3. Chat Link Delivery: The customer receives a link that redirects them to a chat channel, enabling chat communication instead of a voice call.
4. Call Disconnection: The voice call ends, and the customer can continue the conversation through chat.

 Logging and Monitoring
The solution integrates with CloudWatch Logs to capture Lambda execution details and ensure all errors and performance metrics are logged. Additionally, Amazon Connect logging for contact flow executions is enabled.

Conclusion
This solution enables a seamless transition from voice communication to chat, enhancing customer experience while leveraging AWS services like Lambda, Connect, and Pinpoint.



Resouces which are getting created and completed
Lambda function with required environment variables
Lambda execution Role
Connect module along with invoke lambda function which gets created and association of lambda function in connect
Resources which need to modify 
Cloudfront restrict access with key value pair
S3 buckect is getting created but need to upload index .html file 
Pinpoint we need to enable SMS channel
