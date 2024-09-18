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

Resources:
  # Contact Flow Module Resource
  VoiceToChatContactFlowModule:
    Type: "AWS::Connect::ContactFlowModule"
    Properties:
      Name: VoiceToChatFlowModule
      Description: "Contact flow module created using CloudFormation"
      InstanceArn: !Ref ConnectInstanceArn
      Content:
        Fn::Sub: |
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
                "3de54805-ed88-465a-b9d7-ced52cd08303": {
                  "position": {
                    "x": 2676,
                    "y": 100.8
                  },
                  "parameters": {
                    "LambdaFunctionARN": {
                      "displayName": "Voice-to-chat-transfer"
                    }
                  },
                  "dynamicMetadata": {
                    "check": false
                  }
                }
              },
              "Annotations": [],
              "name":"voice to chat Module",
              ...
            },
            ...
            // Actions array begins here.
            Actions: [
              {
                Parameters: { Text: 'lambda error' },
                Identifier: 'c3d3116b4833414d85c754d7ba28ce0a',
                Type: 'MessageParticipant',
                Transitions: { 
                  NextAction: 'a4893b51-4ae1-44ba8127-oad84b24d220', 
                  Errors: [{ NextAction: 'a4893b51–4ae1–44ba–8127–0ad84b24d220', ErrorType: 'NoMatchingError' }] 
                }
              },
              { 
               Parameters: { Text: 'You will receive a chat bot link for the chat channel to your registered Email. Please attempt to click the link so that you can use the chatbot.\nThank you for calling have a nice day.' }, 
               Identifier: '51925f2b42d641728dcc-c794be502eff', 
               Type: 'MessageParticipant', 
               Transitions: { NextAction:'a4893b51–4ae1–44ba–8127–0ad84b24d220', Errors:[{ NextAction:'c3d3116b4833414d85c754d7ba28ce0a', ErrorType:'NoMatchingError' }] } 
              },
              { 
               Parameters:{}, 
               Identifier:'a4893b51–4ae1–44ba–8127–0ad84b24d220', 
               Type:'DisconnectParticipant', 
               Transitions:{} 
              },
              { 
               Parameters:{ LambdaFunctionARN:'arn:aws:lambda:us-east1:768637739934:function:Voice-to-chat-transfer', InvocationTimeLimitSeconds:'3', LambdaInvocationAttributes:{ check:'email' }, ResponseValidation:{ ResponseType:'STRING_MAP' } }, 
               Identifier:'053786fc1-a9d49bb9f3b0615313e7475', 
               Type:'InvokeLambdaFunction', 
               Transitions:{ NextAction:'51925f2b42d641728dcc-c794be502eff', Errors:[{ NextAction:'a4893b51–4ae1–44ba–8127–0ad84b24d220', ErrorType:'NoMatchingError' }] } 
              },
              { 
               Parameters:{ RecordingBehavior:{ RecordedParticipants:['Agent','Customer'] }, AnalyticsBehavior:{ Enabled:'True', AnalyticsLanguage:'en-US', AnalyticsRedactionBehavior:'Disabled', AnalyticsRedactionResults:'RedactedAndOriginal', ChannelConfiguration:{ Chat:{ AnalyticsModes:[] }, Voice:{ AnalyticsModes:['PostContact'] } } } }, 
               Identifier:'a403434c-d7b9–4cd6–80c3-ce76d77112ea', 
               Type:'UpdateContactRecordingBehavior',
               Transitions:{ NextAction:'3b2ac413–3ab7–4702–8545–8d4e416da148' } 
              },
              { 
               Parameters:{ FlowLoggingBehavior:'Enabled' }, 
               Identifier:'1ff34355–4c6a–42fb–8e71–627d4ffcde6a', 
               Type:'UpdateFlowLoggingBehavior',
               Transitions:{ NextAction:'a403434c-d7b9–4cd6–80c3-ce76d77112ea' } 
              },
              { 
               Parameters:{ Text:'error' }, 
               Identifier:'fbd09b5a-c04e46c9–900f–3bcbfb693913',
               Type:'MessageParticipant',
               Transitions:{ NextAction:'4750120e10b04cd892af664d52233b80',
                            Errors:[{ NextAction:'4750120e10b04cd892af664d52233b80',
                                      ErrorType:'NoMatchingError' }] } 
              },
              { 
               Parameters:{}, Identifier:'4750120e10b04cd892af664d52233b80',
               Type:'DisconnectParticipant',
               Transitions:{}  
              },
              {  
               Parameters:{ Text:"You will receive a chat bot link for the chat channel on your mobile device through SMS. Please attempt to click the link so that you can use the chatbot.\nThank you for calling have a nice day." },  
               Identifier:"24d5690dcdfc4e17-a84fd018629c7cf8",  
               Type:"MessageParticipant",  
               Transitions:{ NextAction:"a4893b51-a489344ba81270ad84bd220", Errors:[{ NextAction:"c3d311648334141485754ed28ce0", ErrorType:"NoMatchingError" }] }  
              },  
              {  
               Parameters:{ Text:"You can choose to receive Email Or SMS Texts please select your preference to send the Chat Link to an Email please Press 1 and to send it to a Mobile device Press 2.", StoreInput:"False", InputTimeLimitSeconds:"5" },  
               Identifier:"3b2ac413-aab74022854fa424",  
               Type:"GetParticipantInput",  
               Transitions:{ NextAction:"fbd09b5ac04e46c9", Conditions:[{ NextAction:"053786fc1-a9dd49bb9f3bb0615313e7475", Condition:{ Operator:"Equals", Operands:["1"] }},{ NextAction:"3de54805-ed88465ab97ced52cd08303", Condition:{ Operator:"Equals", Operands:["2"] }}], Errors:[{ NextAction:"fbd09b5ac04e46c9", ErrorType:"InputTimeLimitExceeded"},{ NextAction:"fbd09b5ac04e46c9", ErrorType:"NoMatchingCondition"},{ NextAction:"fbd09b5ac04e46c9", ErrorType:"NoMatchingError" }] }  
              },  
              {  
                 Parameters:{ LambdaFunctionARN:"arn:aws:lambda:us-east1:function:Voice-to-chat-transfer", InvocationTimeLimitSeconds:"3", LambdaInvocationAttributes:{ check:"mobile" }, ResponseValidation:{ ResponseType:"STRING_MAP" }},  
                 Identifier:"3de54805-ed88465ab97ced52cd08303",  
                 Type:"InvokeLambdaFunction",  
                 Transitions:{ NextAction:"24d5690dcdfc4e17-a84fd018629c7cf8", Errors:[{ NextAction:"4750120e10b04cd892af664d52233b80", ErrorType:"NoMatchingError" }] }  
              },  
             {  
             Parameters:{},  
             Identifier:"Settings",  
             Type:"Settings",
             Transitions:[{ DisplayName="Success", ReferenceName="Success", Description=""},{ DisplayName="Error", ReferenceName="Error", Description=""}]   
            }]
          }

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
        S3Bucket: !Ref ModuleS3Bucket # You may want to specify a bucket for Lambda code if needed.
        S3Key: !Ref ModuleS3Key # You may want to specify a key for Lambda code if needed.
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

Outputs:
  ContactFlowModuleArn:
    Description: “The ARN of the created contact flow module”
    Value: !GetAtt VoiceToChatContactFlowModule.Arn

  ContactFlowModuleLambdaFunctionArn:
    Description: “Contact Flow Module Lambda function ARN”
    Value: !GetAtt ContactFlowModuleLambdaFunction.Arn

  PinpointAppForModuleId:
    Description: “Pinpoint app ID for the module”
    Value: !Ref PinpointAppForModule


```