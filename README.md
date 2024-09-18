```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Template for Voice-To-Chat Solution

Parameters:
  ConnectInstanceArn:
    Type: String
  LambdaExecutionRole:
    Type: String
  EmailIdentityArn:
    Type: String

Resources:
  ConnectContactFlowModule1:
    Type: AWS::Connect::ContactFlowModule
    Properties:
      InstanceArn: !Ref ConnectInstanceArn
      Name: VoiceToChatFlowModule1
      Content:
        Fn::Sub:
          - |
            {
              "Version": "2019-10-30",
              "StartAction": "StartAction",
              "Actions": [
                {
                  "Identifier": "StartAction",
                  "Type": "PlayPrompt",
                  "Parameters": {
                    "PromptId": "${PromptId}",
                    "TextToSpeechVoiceId": "Joanna",
                    "TextToSpeechContent": "Welcome to the Voice to Chat service. Please hold while we connect you."
                  },
                  "Transitions": {
                    "NextAction": "WaitForInputAction"
                  }
                },
                {
                  "Identifier": "WaitForInputAction",
                  "Type": "GetUserInput",
                  "Parameters": {
                    "TimeoutSeconds": 30,
                    "InputType": "DTMF",
                    "MaxDigits": 1
                  },
                  "Transitions": {
                    "OnSuccess": {
                      "NextAction": "HandleInputAction"
                    },
                    "OnTimeout": {
                      "NextAction": "TimeoutHandlerAction"
                    }
                  }
                },
                {
                  "Identifier": "HandleInputAction",
                  "Type": "CheckUserInput",
                  "Parameters": {
                    "ExpectedInputs": [
                      {
                        "InputValue": "1",
                        "NextAction": "TransferToChatAction"
                      },
                      {
                        "InputValue": "2",
                        "NextAction": "TransferToAgentAction"
                      }
                    ]
                  }
                },
                {
                  "Identifier": "TransferToChatAction",
                  "Type": "TransferToQueue",
                  "Parameters": {
                    "QueueId": !Ref ChatQueueId
                  }
                },
                {
                  "Identifier": "TransferToAgentAction",
                  "Type": "TransferToQueue",
                  "Parameters": {
                    "QueueId": !Ref AgentQueueId
                  }
                },
                {
                  "Identifier": "TimeoutHandlerAction",
                  "Type": "PlayPrompt",
                  "Parameters": {
                    "PromptId": "${TimeoutPromptId}",
                    "TextToSpeechVoiceId": "Joanna",
                    "TextToSpeechContent": "Sorry, we did not receive any input. Please try again."
                  },
                  "Transitions": {
                    "NextAction": "StartAction"
                  }
                }
              ]
            }
          - PromptId: !Sub "${PromptId}"

  LambdaFunction1:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: VoiceToChatTransferFunction1
      Handler: index.handler
      Role: !Ref LambdaExecutionRole
      Code:
        S3Bucket: voice-to-chat-lambda-solution
        S3Key: VoiceToChatTransferCode.zip
      Runtime: python3.10
      Timeout: 15

  PinpointApp1:
    Type: AWS::Pinpoint::App
    Properties:
      Name: VoiceToChatApp1

  PinpointEmailChannel1:
    Type: AWS::Pinpoint::EmailChannel
    Properties:
      ApplicationId: !Ref PinpointApp1
      FromAddress: ati.pat85@outlook.com
      Identity: !Ref EmailIdentityArn
      RoleArn: !Ref LambdaExecutionRole

  S3Bucket1:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "${AWS::AccountId}-voice-to-chat-bucket-${AWS::Region}"

  CloudFrontDistribution1:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket1.RegionalDomainName
            Id: S3Origin1
            S3OriginConfig: {}
        Enabled: true
        DefaultCacheBehavior:
          TargetOriginId: S3Origin1
          ViewerProtocolPolicy: redirect-to-https
          ForwardedValues:
            QueryString: false
        DefaultRootObject: index.html

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
  
  S3BucketName1:
    Description: "S3 bucket name"
    Value: !Ref S3Bucket1
  
  CloudFrontDistributionId1:
    Description: "CloudFront distribution ID"
    Value: !Ref CloudFrontDistribution1


```