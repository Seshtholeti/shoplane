Timestamp
	
Logical ID
	
Status
	
Detailed status
	
Status reason

Timestamp
	
Logical ID
	
Status
	
Detailed status
	
Status reason

2024-09-30 15:50:02 UTC+0530
ConnectContactFlowModule
DELETE_COMPLETE
-
-
2024-09-30 15:50:01 UTC+0530
VoiceToChatLambdaFunction
DELETE_IN_PROGRESS
-
-
2024-09-30 15:50:01 UTC+0530
ConnectContactFlowModule
DELETE_IN_PROGRESS
-
-
2024-09-30 15:49:59 UTC+0530
voice-to-chat-model1
ROLLBACK_IN_PROGRESS
-
The following resource(s) failed to create: [VoiceToChatLambdaFunction]. Rollback requested by user.
2024-09-30 15:49:58 UTC+0530
VoiceToChatLambdaFunction
CREATE_FAILED
-
Resource handler returned message: "Error occurred while GetObject. S3 Error Code: NoSuchKey. S3 Error Message: The specified key does not exist. (Service: Lambda, Status Code: 400, Request ID: 531a777d-6142-4c40-86e5-f61de45d2f68)" (RequestToken: 244ba1bc-ce03-b078-364a-0c7746537f77, HandlerErrorCode: InvalidRequest)
AWSTemplateFormatVersion: "2010-09-09"
Description: Template for Voice-To-Chat Solution Module

Parameters:
  ConnectInstanceArn:
    Type: String
    Description: ARN of the Amazon Connect instance
  EmailIdentityArn:
    Type: String
    Description: ARN of the email identity for Pinpoint

Resources:
  # Lambda Function for Voice to Chat Transfer
  VoiceToChatLambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: VoiceToChatTransferFunction
      Handler: index.handler
      Role: !GetAtt LambdaExecutionRole.Arn
      Code:
        S3Bucket: voice-to-chat-lambda-solution
        S3Key: Voice-to-chat-transfer.zip
      Runtime: python3.10
      Timeout: 15

  # Lambda Execution Role for VoiceToChatTransferFunction
  LambdaExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: VoiceToChatLambdaExecutionPolicy
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
                  - logs:CreateLogGroup
                  - logs:CreateLogStream
                  - logs:PutLogEvents
                Resource: "*"
              - Effect: Allow
                Action:
                  - s3:GetObject
                Resource: "*"
              - Effect: Allow
                Action:
                  - connect:StartOutboundVoiceContact
                  - connect:StartChatContact
                  - connect:DescribeContactFlow
                Resource: "*"
              - Effect: Allow
                Action:
                  - pinpoint:SendMessages
                Resource: "*"
