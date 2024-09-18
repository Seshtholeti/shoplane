AWSTemplateFormatVersion: 2010-09-09
Description: Template for Voice-To-Chat Solution

Parameters:
  ConnectInstanceArn:
    Type: String
    Description: "The ARN of the Amazon Connect instance."

  LambdaExecutionRole:
    Type: String
    Description: "The ARN of the IAM role that Lambda will assume."

  EmailIdentityArn:
    Type: String
    Description: "The ARN of the email identity for Amazon Pinpoint."

Resources:
  ConnectContactFlowModule1:
    Type: AWS::Connect::ContactFlowModule
    Properties:
      InstanceArn: !Ref ConnectInstanceArn
      Name: VoiceToChatFlowModule1-001 # Unique name with a number
      Content:
        Fn::Sub: |
          {
            "Version": "2019-10-30",
            "StartAction": "3b2ac413-3ab7-4702-8545-8d4e416da148",
            "Metadata": {
              "entryPointPosition": {
                "x": 1114.4,
                "y": 41.6
              },
              "ActionMetadata": {
                "c3d3116b-4833-414d-85c7-54d7ba28ce0a": {
                  "position": {
                    "x": 3432.8,
                    "y": 5.6
                  }
                },
                "51925f2b-42d6-4172-8dcc-c794be502eff": {
                  "position": {
                    "x": 3142.4,
                    "y": -166.4
                  }
                },
                "a4893b51-4ae1-44ba-8127-0ad84b24d220": {
                  "position": {
                    "x": 4043.2,
                    "y": 12
                  }
                },
                "053786fc-1a9d-49bb-9f3b-0615313e7475": {
                  "position": {
                    "x": 2664.8,
                    "y": -164
                  },
                  "parameters": {
                    "LambdaFunctionARN": {
                      "displayName": "Voice-to-chat-transfer"
                    }
                  },
                  "dynamicMetadata": {
                    "check": false
                  }
                },
                "a403434c-d7b9-4cd6-80c3-ce76d77112ea": {
                  "position": {
                    "x": 1862.4,
                    "y": 4.8
                  }
                },
                "1ff34355-4c6a-42fb-8e71-627d4ffcde6a": {
                  "position": {
                    "x": 1432.8,
                    "y": 13.6
                  }
                },
                "fbd09b5a-c04e-46c9-900f-3bcbfb693913": {
                  "position": {
                    "x": 2665.6,
                    "y": 330.4
                  }
                },
                "4750120e-10b0-4cd8-92af-664d52233b80": {
                  "position": {
                    "x": 3153.6,
                    "y": 368.8
                  }
                },
                "24d5690d-cdfc-4e17-a84f-d018629c7cf8": {
                  "position": {
                    "x": 3149.6,
                    "y": 103.2
                  }
                },
                // Additional action metadata can be added here if needed.
              }
            },
            // Actions array begins here.
            “Actions”: [
              {
                “Parameters”: { “Text”: “lambda error” },
                “Identifier”: “c3d3116b–4833–414d–85c7–54d7ba28ce0a”,
                “Type”: “MessageParticipant”,
                “Transitions”: { 
                  “NextAction”: “51925f2b–42d6–4172–8dcc–c794be502eff”,
                  “Errors”: [{“NextAction”: “51925f2b–42d6–4172–8dcc–c794be502eff”, “ErrorType”: “NoMatchingError”}]
                }
              },
              {
                “Parameters”: { 
                  “Text”: “You will receive a chat bot link for the chat channel to your registered Email. Please attempt to click the link so that you can use the chatbot.\nThank you for calling have a nice day.” 
                },
                “Identifier”: “51925f2b–42d6–4172–8dcc–c794be502eff”,
                “Type”: “MessageParticipant”,
                “Transitions”: { 
                   “NextAction”: “053786fc–1a9d–49bb–9f3b–0615313e7475”, 
                   “Errors”: [{“NextAction”: “c3d3116b–4833–414d–85c7–54d7ba28ce0a”, “ErrorType”: “NoMatchingError”}]
                 } 
               },
               { 
                 “Parameters”: {}, 
                 “Identifier”: “053786fc–1a9d–49bb–9f3b–0615313e7475”, 
                 “Type”: “DisconnectParticipant”, 
                 “Transitions”: {} 
               }, 
               { 
                 “Parameters”: { 
                   “LambdaFunctionARN”:“arn:aws:lambda:us-east-1:768637739934:function:Voice-to-chat-transfer-lambda001”, 
                   “InvocationTimeLimitSeconds”:“3”, 
                   “LambdaInvocationAttributes”:{“check”:“email”}, 
                   “ResponseValidation”:{“ResponseType”:“STRING_MAP”} 
                 }, 
                 “Identifier”:“053786fc–1a9d–49bb–9f3b–0615313e7475”, 
                 “Type”:“InvokeLambdaFunction”, 
                 “Transitions”:{ 
                   “NextAction”:“51925f2b–42d6–4172–8dcc–c794be502eff”, 
                   “Errors”:[{“NextAction”:“053786fc–1a9d–49bb–9f3b–0615313e7475”,“ErrorType”:“NoMatchingError”}] 
                 } 
               }, 
               { 
                 “Parameters”：{“RecordingBehavior”：{“RecordedParticipants”：["Agent","Customer"]},“AnalyticsBehavior”：{“Enabled”：true,“AnalyticsLanguage”："en-US","AnalyticsRedactionBehavior":"Disabled","AnalyticsRedactionResults":"RedactedAndOriginal","ChannelConfiguration":{"Chat":{"AnalyticsModes":[]},"Voice":{"AnalyticsModes":["PostContact"]}}}}, 
                 ”Identifier”:"a403434c-d7b9--4cd6--80c3--ce76d77112ea", ”Type”:"UpdateContactRecordingBehavior", ”Transitions”：{ ”NextAction”:"24d5690d-cdfc-4e17-a84f-d018629c7cf8"}}, 

             ]
           }

  LambdaFunction1:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: Voice-to-chat-transfer-lambda01 # Unique name with a number
      Handler: index.handler
      Role: !Ref LambdaExecutionRole
      Code:
        S3Bucket: voice-to-chat-lambda-solution
        S3Key: Voice-to-chat-transfer.zip
      Runtime: python3.10
      Timeout: 15

  PinpointApp1:
    Type: AWS::Pinpoint::App
    Properties:
      Name: voice-to-chat-app01 # Unique name with a number

  PinpointEmailChannel1:
    Type: AWS::Pinpoint::EmailChannel
    Properties:
      ApplicationId: !Ref PinpointApp1
      FromAddress: ati.pat85@outlook.com # Using the same email address as before.
      Identity: !Ref EmailIdentityArn
      RoleArn: !Ref LambdaExecutionRole

Outputs:
  ConnectContactFlowModuleId1:
    Description: "Connect contact flow module ID"
    Value: !Ref ConnectContactFlowModule1

  LambdaFunctionArn1:
    Description: "Lambda function ARN"
    Value: !GetAtt LambdaFunction1.Arn

  PinpointAppId1:
    Description: "Pinpoint app ID"
    Value: !Ref PinpointApp1



2024-09-18 09:15:43 UTC+0530
voice-to-chat-model1
ROLLBACK_COMPLETE
-
-
2024-09-18 09:15:43 UTC+0530
ConnectContactFlowModule1
DELETE_COMPLETE
-
-
2024-09-18 09:13:18 UTC+0530
LambdaFunction1
DELETE_COMPLETE
-
-
2024-09-18 09:13:13 UTC+0530
PinpointApp1
DELETE_COMPLETE
-
-
2024-09-18 09:13:12 UTC+0530
PinpointApp1
DELETE_IN_PROGRESS
-
-
2024-09-18 09:13:12 UTC+0530
LambdaFunction1
DELETE_IN_PROGRESS
-
-
2024-09-18 09:13:10 UTC+0530
voice-to-chat-model1
ROLLBACK_IN_PROGRESS
-
The following resource(s) failed to create: [ConnectContactFlowModule1, LambdaFunction1]. Rollback requested by user.
2024-09-18 09:13:10 UTC+0530
LambdaFunction1
CREATE_FAILED
-
Resource creation cancelled
2024-09-18 09:13:09 UTC+0530
PinpointApp1
CREATE_COMPLETE
-
-
2024-09-18 09:13:09 UTC+0530
LambdaFunction1
CREATE_IN_PROGRESS
-
Resource creation Initiated
2024-09-18 09:13:09 UTC+0530
ConnectContactFlowModule1
CREATE_FAILED
-
Resource handler returned message: "Service returned error code InvalidContactFlowModuleException (Service: Connect, Status Code: 400, Request ID: 4edb39a7-25d6-4da6-a577-212154e83c1f)" (RequestToken: 8f499604-8765-44a8-2b16-7f40e58b777c, HandlerErrorCode: InvalidRequest)



# AWSTemplateFormatVersion: 2010-09-09
# Description: Template for Voice-To-Chat Solution

# Parameters:
#   ConnectInstanceArn:
#     Type: String
#   LambdaExecutionRole:
#     Type: String
#   EmailIdentityArn:
#     Type: String
#   ContactFlowS3Bucket:
#     Type: String
#   ContactFlowS3Key:
#     Type: String

# Resources:
#   ConnectContactFlow:
#     Type: AWS::Connect::ContactFlow
#     Properties:
#       InstanceArn: !Ref ConnectInstanceArn
#       Name: VoiceToChatFlow
#       Type: CONTACT_FLOW
#       Fn::Transform:
#         Name: "AWS::Include"
#         Parameters:
#           Location: !Sub "s3://${ContactFlowS3Bucket}/${ContactFlowS3Key}"

#   LambdaFunction:
#     Type: AWS::Lambda::Function
#     Properties:
#       FunctionName: Voice-to-chat-transfer-unique
#       Handler: index.handler
#       Role: !Ref LambdaExecutionRole
#       Code:
#         S3Bucket: voice-to-chat-lambda-solution
#         S3Key: Voice-to-chat-transfer-2b6ec221-f880-43a1-af57-544ebd835c7b.zip
#       Runtime: python3.10
#       Timeout: 15

#   PinpointApp:
#     Type: AWS::Pinpoint::App
#     Properties:
#       Name: voice-to-chat

#   PinpointEmailChannel:
#     Type: AWS::Pinpoint::EmailChannel
#     Properties:
#       ApplicationId: !Ref PinpointApp
#       FromAddress: ati.pat85@outlook.com # Using the same email address as before
#       Identity: !Ref EmailIdentityArn
#       RoleArn: !Ref LambdaExecutionRole

#   S3Bucket:
#     Type: AWS::S3::Bucket
#     Properties:
#       BucketName: my-unique-bucket-name12345 # Change this to a unique name

#   CloudFrontDistribution:
#     Type: AWS::CloudFront::Distribution
#     Properties:
#       DistributionConfig:
#         Origins:
#           - DomainName: !GetAtt S3Bucket.RegionalDomainName
#             Id: S3Origin
#             S3OriginConfig: {}
#         Enabled: true
#         DefaultCacheBehavior:
#           TargetOriginId: S3Origin
#           ViewerProtocolPolicy: redirect-to-https
#           ForwardedValues:
#             QueryString: false
#         DefaultRootObject: index.html

# Outputs:
#   ConnectContactFlowId:
#     Description: "Connect contact flow ID"
#     Value: !Ref ConnectContactFlow
#   LambdaFunctionArn:
#     Description: "Lambda function ARN"
#     Value: !GetAtt LambdaFunction.Arn
#   PinpointAppId:
#     Description: "Pinpoint app ID"
#     Value: !Ref PinpointApp
#   S3BucketName:
#     Description: "S3 bucket name"
#     Value: !Ref S3Bucket
#   CloudFrontDistributionId:
#     Description: "CloudFront distribution ID"
#     Value: !Ref CloudFrontDistribution


this is the code which was created earlier for contact flow and now the error one was for module. also check the lambda error
