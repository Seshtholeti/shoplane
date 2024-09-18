```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Template for Voice-To-Chat Solution with Contact Flow Module

Parameters:
  ConnectInstanceArn:
    Type: String
    Description: "The ARN of the Amazon Connect instance"

  LambdaExecutionRole:
    Type: String
    Description: "The ARN of the IAM role that Lambda functions will assume"

  EmailIdentityArn:
    Type: String
    Description: "The ARN of the email identity used for sending emails"

  ModuleS3Bucket:
    Type: String
    Description: "The S3 bucket where the module JSON content is stored"

  ModuleS3Key:
    Type: String
    Description: "The S3 key for the module JSON file"

Resources:
  # Contact Flow Module Resource
  VoiceToChatContactFlowModule:
    Type: "AWS::Connect::ContactFlowModule"
    Properties:
      Name: VoiceToChatFlowModule
      Description: "Contact flow module created using CloudFormation"
      InstanceArn: !Ref ConnectInstanceArn
      Content:
        Fn::Transform:
          Name: "AWS::Include"
          Parameters:
            Location: !Sub "s3://${ModuleS3Bucket}/${ModuleS3Key}"
      Tags:
        - Key: testkey
          Value: testValue

  ContactFlowModuleLambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: VoiceToChatContactFlowHandler
      Handler: index.handler
      Role: !Ref LambdaExecutionRole
      Code:
        S3Bucket: !Ref ModuleS3Bucket
        S3Key: !Ref ModuleS3Key
      Runtime: python3.10
      Timeout: 15

  # Pinpoint App for tracking interactions related to the module
  PinpointAppForModule:
    Type: AWS::Pinpoint::App
    Properties:
      Name: voice-to-chat-module

  PinpointEmailChannelForModule:
    Type: AWS::Pinpoint::EmailChannel
    Properties:
      ApplicationId: !Ref PinpointAppForModule
      FromAddress: ati.pat85@outlook.com
      Identity: !Ref EmailIdentityArn
      RoleArn: !Ref LambdaExecutionRole

  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name123456

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig: {}
        Enabled: true
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          ForwardedValues:
            QueryString: false
        DefaultRootObject: index.html

Outputs:
  ContactFlowModuleArn:
    Description: "The ARN of the created contact flow module"
    Value: !GetAtt VoiceToChatContactFlowModule.Arn

  ContactFlowModuleLambdaFunctionArn:
    Description: "Contact Flow Module Lambda function ARN"
    Value: !GetAtt ContactFlowModuleLambdaFunction.Arn

  PinpointAppForModuleId:
    Description: "Pinpoint app ID for the module"
    Value: !Ref PinpointAppForModule

  S3BucketName:
    Description: "S3 bucket name"
    Value: !Ref S3Bucket

  CloudFrontDistributionId:
    Description: "CloudFront distribution ID"
    Value: !Ref CloudFrontDistribution

# JSON Content for the Contact Flow Module
ContentJson:
  Content:

{
  "Version": "2019-10-30",
  "StartAction": "1ff34355-4c6a-42fb-8e71-627d4ffcde6a",
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
      "3b2ac413-3ab7-4702-8545-8d4e416da148": {
        "position": {
          "x": 2269.6,
          "y": -42.4
        },
        "conditionMetadata": [
          {
            "id": "35191358-4edb-40f8-957e-19d88bc0f5c5",
            "value": "1"
          },
          {
            "id": "3499b595-d904-45d9-a6a8-8f5140d7ad4f",
            "value": "2"
          }
        ]
      },
      ...
      
     // Additional action metadata would be listed here.
      
     }
   },
   ...
   
   // Additional properties and actions would be listed here.
}

```