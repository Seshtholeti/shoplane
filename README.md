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

  # Contact Flow Module for Amazon Connect
  ConnectContactFlowModule:
    Type: AWS::Connect::ContactFlowModule
    Properties:
      InstanceArn: !Ref ConnectInstanceArn
      Name: VoiceToChatFlowModule
      Content: |
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
                    "displayName": "Voice-to-chat-transfer",
                    "value": !GetAtt VoiceToChatLambdaFunction.Arn
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
                    "displayName": "Voice-to-chat-transfer",
                    "value": !GetAtt VoiceToChatLambdaFunction.Arn
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
                "LambdaFunctionARN": !GetAtt VoiceToChatLambdaFunction.Arn,
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
            }
          ]
        }