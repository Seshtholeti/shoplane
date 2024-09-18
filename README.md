```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Template for Very Basic Voice-To-Chat Solution

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
      Name: BasicVoiceToChatFlowModule
      Content:
        Fn::Sub:
          - |
            {
              "Version": "2019-10-30",
              "StartAction": "WelcomeAction",
              "Actions": [
                {
                  "Identifier": "WelcomeAction",
                  "Type": "PlayPrompt",
                  "Parameters": {
                    "TextToSpeechVoiceId": "Joanna",
                    "TextToSpeechContent": "Welcome to our service. Thank you for calling."
                  },
                  "Transitions": {
                    "NextAction": "EndCallAction"
                  }
                },
                {
                  "Identifier": "EndCallAction",
                  "Type": "Disconnect",
                  "Parameters": {}
                }
              ]
            }
          - {}

  LambdaFunction1:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: BasicVoiceToChatLambdaFunction
      Handler: index.handler
      Role: !Ref LambdaExecutionRole
      Code:
        S3Bucket: voice-to-chat-lambda-solution
        S3Key: BasicVoiceToChatLambdaCode.zip
      Runtime: python3.10
      Timeout: 15

  PinpointApp1:
    Type: AWS::Pinpoint::App
    Properties:
      Name: BasicVoiceToChatApp

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
      BucketName: !Sub "${AWS::AccountId}-basic-voice-to-chat-bucket-${AWS::Region}"

Outputs:
  ConnectContactFlowModuleId1:
    Description: Basic contact flow module ID
    Value: !Ref ConnectContactFlowModule1
  
  LambdaFunctionArn1:
    Description: Lambda function ARN
    Value: !GetAtt LambdaFunction1.Arn
  
  PinpointAppId1:
    Description: Pinpoint app ID
    Value: !Ref PinpointApp1
  
  S3BucketName1:
    Description: S3 bucket name
    Value: !Ref S3Bucket1


```