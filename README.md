AWSTemplateFormatVersion: "2010-09-09"
Description: Template for Voice-To-Chat Solution Module

Parameters:
  ConnectInstanceArn:
    Type: String
    Description: ARN of the Amazon Connect instance
  EmailIdentityArn:
    Type: String
    Description: ARN of the email identity for Pinpoint
  ConnectModuleName:
    Type: String
    Description: Name for the connect contact flow module.
    Default: "VoiceToChatFlow"
  LambdaFunctionName:
    Type: String
    Description: Name for the Lambda Function.
    Default: "MyLambdaFunction"

Resources:
  # Lambda Function for Voice to Chat Transfer
  VoiceToChatLambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: !Ref LambdaFunctionName
      Handler: index.handler
      Role: !GetAtt LambdaExecutionRole.Arn
      Code:
        S3Bucket: voice-to-chat-lambda-solution
        S3Key: Voice-to-chat-transfer-2b6ec221-f880-43a1-af57-544ebd835c7b.zip
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

    # Lambda and Amazon Connect Integration
  ConnectLambdaAssociation:
    Type: AWS::Connect::InstanceLambdaFunctionAssociation
    Properties:
      InstanceArn: !Ref ConnectInstanceArn
      FunctionArn: !GetAtt VoiceToChatLambdaFunction.Arn
      TriggerEventSource: CONTACT_FLOW
  # Contact Flow Module for Amazon Connect
  ConnectContactFlowModule:
    Type: AWS::Connect::ContactFlowModule
    Properties:
      InstanceArn: !Ref ConnectInstanceArn
      Name: !Ref ConnectModuleName
      Content: !Sub |
        {
          "Version": "2019-10-30",
          "StartAction": "1ff34355-4c6a-42fb-8e71-627d4ffcde6a",
          "Metadata": {
            "entryPointPosition": {
              "x": 106.4,
              "y": -152
            },
            "ActionMetadata": {
              "1ff34355-4c6a-42fb-8e71-627d4ffcde6a": {
                "position": {
                  "x": 148.8,
                  "y": -5.6
                }
              },
              "a403434c-d7b9-4cd6-80c3-ce76d77112ea": {
                "position": {
                  "x": 155.2,
                  "y": 196
                }
              },
              "fbd09b5a-c04e-46c9-900f-3bcbfb693913": {
                "position": {
                  "x": 792.8,
                  "y": 116
                }
              },
              "053786fc-1a9d-49bb-9f3b-0615313e7475": {
                "position": {
                  "x": 770.4,
                  "y": -327.2
                },
                "parameters": {
                  "LambdaFunctionARN": {
                    "displayName": "${LambdaFunctionName}",
                    "value": "!GetAtt MyLambdaFunction.Arn"
                  }
                },
                "dynamicMetadata": {
                  "check": false
                }
              },
              "c3d3116b-4833-414d-85c7-54d7ba28ce0a": {
                "position": {
                  "x": 1349.6,
                  "y": 49.6
                }
              },
              "a4893b51-4ae1-44ba-8127-0ad84b24d220": {
                "position": {
                  "x": 1794.4,
                  "y": -236
                }
              },
              "51925f2b-42d6-4172-8dcc-c794be502eff": {
                "position": {
                  "x": 1104,
                  "y": -358.4
                }
              },
              "3b2ac413-3ab7-4702-8545-8d4e416da148": {
                "position": {
                  "x": 389.6,
                  "y": -86.4
                },
                "conditionMetadata": [
                  {
                    "id": "cfcd304d-3a11-4932-9a47-d0de8ae40897",
                    "value": "1"
                  },
                  {
                    "id": "6a52c195-771e-4daf-9e7f-25a0939dd097",
                    "value": "2"
                  }
                ]
              },
              "4750120e-10b0-4cd8-92af-664d52233b80": {
                "position": {
                  "x": 1095.2,
                  "y": 191.2
                }
              },
              "24d5690d-cdfc-4e17-a84f-d018629c7cf8": {
                "position": {
                  "x": 1095.2,
                  "y": -102.4
                }
              },
              "3de54805-ed88-465a-b9d7-ced52cd08303": {
                "position": {
                  "x": 791.2,
                  "y": -136
                },
                "parameters": {
                  "LambdaFunctionARN": {
                    "displayName": "${LambdaFunctionName}",
                    "value": "!GetAtt MyLambdaFunction.Arn"
                  }
                },
                "dynamicMetadata": {
                  "check": false
                }
              }
            },
            "Annotations": [],
            "name": "voice to chat-Module",
            "description": "Sagar: Invoked from Main IVR to enable functionality to deflect Voice Call to Chat Channel",
            "status": "published",
            "hash": {}
          },
          "Actions": [
            {
              "Parameters": {
                "FlowLoggingBehavior": "Enabled"
              },
              "Identifier": "1ff34355-4c6a-42fb-8e71-627d4ffcde6a",
              "Type": "UpdateFlowLoggingBehavior",
              "Transitions": {
                "NextAction": "a403434c-d7b9-4cd6-80c3-ce76d77112ea"
              }
            },
            {
              "Parameters": {
                "RecordingBehavior": {
                  "RecordedParticipants": [
                    "Agent",
                    "Customer"
                  ]
                },
                "AnalyticsBehavior": {
                  "Enabled": "True",
                  "AnalyticsLanguage": "en-US",
                  "AnalyticsRedactionBehavior": "Disabled",
                  "AnalyticsRedactionResults": "RedactedAndOriginal",
                  "ChannelConfiguration": {
                    "Chat": {
                      "AnalyticsModes": []
                    },
                    "Voice": {
                      "AnalyticsModes": [
                        "PostContact"
                      ]
                    }
                  }
                }
              },
              "Identifier": "a403434c-d7b9-4cd6-80c3-ce76d77112ea",
              "Type": "UpdateContactRecordingBehavior",
              "Transitions": {
                "NextAction": "3b2ac413-3ab7-4702-8545-8d4e416da148"
              }
            },
            {
              "Parameters": {
                "Text": "error"
              },
              "Identifier": "fbd09b5a-c04e-46c9-900f-3bcbfb693913",
              "Type": "MessageParticipant",
              "Transitions": {
                "NextAction": "4750120e-10b0-4cd8-92af-664d52233b80",
                "Errors": [
                  {
                    "NextAction": "4750120e-10b0-4cd8-92af-664d52233b80",
                    "ErrorType": "NoMatchingError"
                  }
                ]
              }
            },
            {
              "Parameters": {
                "LambdaFunctionARN": "!GetAtt VoiceToChatLambdaFunction.Arn",
                "InvocationTimeLimitSeconds": "3",
                "LambdaInvocationAttributes": {
                  "check": "email"
                },
                "ResponseValidation": {
                  "ResponseType": "STRING_MAP"
                }
              },
              "Identifier": "053786fc-1a9d-49bb-9f3b-0615313e7475",
              "Type": "InvokeLambdaFunction",
              "Transitions": {
                "NextAction": "51925f2b-42d6-4172-8dcc-c794be502eff",
                "Errors": [
                  {
                    "NextAction": "a4893b51-4ae1-44ba-8127-0ad84b24d220",
                    "ErrorType": "NoMatchingError"
                  }
                ]
              }
            },
            {
              "Parameters": {
                "Text": "lambda error"
              },
              "Identifier": "c3d3116b-4833-414d-85c7-54d7ba28ce0a",
              "Type": "MessageParticipant",
              "Transitions": {
                "NextAction": "a4893b51-4ae1-44ba-8127-0ad84b24d220",
                "Errors": [
                  {
                    "NextAction": "a4893b51-4ae1-44ba-8127-0ad84b24d220",
                    "ErrorType": "NoMatchingError"
                  }
                ]
              }
            },
            {
              "Parameters": {},
              "Identifier": "a4893b51-4ae1-44ba-8127-0ad84b24d220",
              "Type": "DisconnectParticipant",
              "Transitions": {}
            },
            {
              "Parameters": {
                "Text": "You will receive a chat bot link for the chat channel to your registered Email. Please attempt to click the link so that you can use the chatbot.\nThank you for calling have a nice day."
              },
              "Identifier": "51925f2b-42d6-4172-8dcc-c794be502eff",
              "Type": "MessageParticipant",
              "Transitions": {
                "NextAction": "a4893b51-4ae1-44ba-8127-0ad84b24d220",
                "Errors": [
                  {
                    "NextAction": "c3d3116b-4833-414d-85c7-54d7ba28ce0a",
                    "ErrorType": "NoMatchingError"
                  }
                ]
              }
            },
            {
              "Parameters": {
                "Text": "You can choose to receive Email Or SMS Texts please select your preference to send the Chat Link to an Email please Press 1 and to send it to a Mobile device Press 2 .",
                "StoreInput": "False",
                "InputTimeLimitSeconds": "5"
              },
              "Identifier": "3b2ac413-3ab7-4702-8545-8d4e416da148",
              "Type": "GetParticipantInput",
              "Transitions": {
                "NextAction": "fbd09b5a-c04e-46c9-900f-3bcbfb693913",
                "Conditions": [
                  {
                    "NextAction": "053786fc-1a9d-49bb-9f3b-0615313e7475",
                    "Condition": {
                      "Operator": "Equals",
                      "Operands": [
                        "1"
                      ]
                    }
                  },
                  {
                    "NextAction": "3de54805-ed88-465a-b9d7-ced52cd08303",
                    "Condition": {
                      "Operator": "Equals",
                      "Operands": [
                        "2"
                      ]
                    }
                  }
                ],
                "Errors": [
                  {
                    "NextAction": "fbd09b5a-c04e-46c9-900f-3bcbfb693913",
                    "ErrorType": "InputTimeLimitExceeded"
                  },
                  {
                    "NextAction": "fbd09b5a-c04e-46c9-900f-3bcbfb693913",
                    "ErrorType": "NoMatchingCondition"
                  },
                  {
                    "NextAction": "fbd09b5a-c04e-46c9-900f-3bcbfb693913",
                    "ErrorType": "NoMatchingError"
                  }
                ]
              }
            },
            {
              "Parameters": {},
              "Identifier": "4750120e-10b0-4cd8-92af-664d52233b80",
              "Type": "DisconnectParticipant",
              "Transitions": {}
            },
            {
              "Parameters": {
                "Text": "You will receive a chat bot link for the chat channel on your mobile device through SMS. Please attempt to click the link so that you can use the chatbot.Thank you for calling have a nice day."
              },
              "Identifier": "24d5690d-cdfc-4e17-a84f-d018629c7cf8",
              "Type": "MessageParticipant",
              "Transitions": {
                "NextAction": "a4893b51-4ae1-44ba-8127-0ad84b24d220",
                "Errors": [
                  {
                    "NextAction": "c3d3116b-4833-414d-85c7-54d7ba28ce0a",
                    "ErrorType": "NoMatchingError"
                  }
                ]
              }
            },
            {
              "Parameters": {
                "LambdaFunctionARN": "!GetAtt VoiceToChatLambdaFunction.Arn",
                "InvocationTimeLimitSeconds": "8",
                "LambdaInvocationAttributes": {
                  "check": "mobile"
                },
                "ResponseValidation": {
                  "ResponseType": "STRING_MAP"
                }
              },
            "Identifier": "3de54805-ed88-465a-b9d7-ced52cd08303",
            "Type": "InvokeLambdaFunction",
            "Transitions": {
              "NextAction": "24d5690d-cdfc-4e17-a84f-d018629c7cf8",
              "Errors": [
                {
                  "NextAction": "4750120e-10b0-4cd8-92af-664d52233b80",
                  "ErrorType": "NoMatchingError"
                }
              ]
            }
          }
        ],
        "Settings": {
          "InputParameters": [],
          "OutputParameters": [],
          "Transitions": [
            {
              "DisplayName": "Success",
              "ReferenceName": "Success",
              "Description": ""
            },
            {
              "DisplayName": "Error",
              "ReferenceName": "Error",
              "Description": ""
            }
          ]
        }
        }

  PinpointApp:
    Type: AWS::Pinpoint::App
    Properties:
      Name: VoiceToChatApp
  PinpointEmailChannel:
    Type: AWS::Pinpoint::EmailChannel
    Properties:
      ApplicationId: !Ref PinpointApp
      FromAddress: ati.pat85@outlook.com
      Identity: !Ref EmailIdentityArn
      RoleArn: !Ref LambdaExecutionRole
  S3BucketForContactFlows:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name-for-contact-flows
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3BucketForContactFlows.RegionalDomainName
            Id: S3OriginForContactFlows
            S3OriginConfig: {}
        Enabled: true
        DefaultCacheBehavior:
          TargetOriginId: S3OriginForContactFlows
          ViewerProtocolPolicy: redirect-to-https
          ForwardedValues:
            QueryString: false
        DefaultRootObject: index.html
  # CloudFrontDistribution:
  #   Type: AWS::CloudFront::Distribution
  #   Properties:
  #     DistributionConfig:
  #       Origins:
  #         - DomainName: !GetAtt S3BucketForContactFlows.RegionalDomainName
  #           Id: S3OriginForContactFlows
  #           S3OriginConfig: {}
Outputs:
  LambdaFunctionArn:
    Description: ARN of the Lambda Function
    Value: !GetAtt VoiceToChatLambdaFunction.Arn
  ConnectContactFlowModuleArn:
    Description: ARN of the Connect Contact Flow Module
    Value: !Ref ConnectContactFlowModule
  PinpointAppId:
    Description: ID of the Pinpoint Application
    Value: !Ref PinpointApp
  VoiceRecordingBucketName:
    Description: Name of the S3 Bucket for Voice Recordings
    Value: !Ref S3BucketForContactFlows
#   PinpointApp:
#     Type: AWS::Pinpoint::App
#     Properties:
#       Name: VoiceToChatApp
#   PinpointEmailChannel:
#     Type: AWS::Pinpoint::EmailChannel
#     Properties:
#       ApplicationId: !Ref PinpointApp
#       FromAddress: ati.pat85@outlook.com
#       Identity: !Ref EmailIdentityArn
#       RoleArn: !Ref LambdaExecutionRole
#   S3BucketForContactFlows:
#     Type: AWS::S3::Bucket
#     Properties:
#       BucketName: my-unique-bucket-name-for-contact-flows
#   CloudFrontDistribution:
#     Type: AWS::CloudFront::Distribution
#     Properties:
#       DistributionConfig:
#         Origins:
#           - DomainName: !GetAtt S3BucketForContactFlows.RegionalDomainName
#             Id: S3OriginForContactFlows
#             S3OriginConfig: {}
# Outputs:
#   LambdaFunctionArn:
#     Description: ARN of the Lambda Function
#     Value: !GetAtt VoiceToChatLambdaFunction.Arn
#   ConnectContactFlowModuleArn:
#     Description: ARN of the Connect Contact Flow Module
#     Value: !Ref ConnectContactFlowModule
#   PinpointAppId:
#     Description: ID of the Pinpoint Application
#     Value: !Ref PinpointApp
#   VoiceRecordingBucketName:
#     Description: Name of the S3 Bucket for Voice Recordings
#     Value: !Ref S3BucketForContactFlows


this is the error
