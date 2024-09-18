AWSTemplateFormatVersion: 2010-09-09
Description: Template for Voice-To-Chat Solution

Parameters:
  ConnectInstanceArn:
    Type: String
  LambdaExecutionRole:
    Type: String
  EmailIdentityArn:
    Type: String
  ContactFlowModuleS3Bucket:
    Type: String
  ContactFlowModuleS3Key:
    Type: String

Resources:
  ConnectContactFlowModule1:
    Type: AWS::Connect::ContactFlowModule
    Properties:
      InstanceArn: !Ref ConnectInstanceArn
      Name: VoiceToChatFlowModule1
      Content:
        Fn::Transform:
          Name: "AWS::Include"
          Parameters:
            Location: !Sub "s3://${ContactFlowModuleS3Bucket}/${ContactFlowModuleS3Key}"

  LambdaFunction1:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: Voice-to-chat-transfer-unique1
      Handler: index.handler
      Role: !Ref LambdaExecutionRole
      Code:
        S3Bucket: voice-to-chat-lambda-solution
        S3Key: Voice-to-chat-transfer-2b6ec221-f880-43a1-af57-544ebd835c7b.zip
      Runtime: python3.10
      Timeout: 15

  PinpointApp1:
    Type: AWS::Pinpoint::App
    Properties:
      Name: voice-to-chat1

  PinpointEmailChannel1:
    Type: AWS::Pinpoint::EmailChannel
    Properties:
      ApplicationId: !Ref PinpointApp1
      FromAddress: ati.pat85@outlook.com # Using the same email address as before
      Identity: !Ref EmailIdentityArn
      RoleArn: !Ref LambdaExecutionRole

  S3Bucket1:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "my-unique-bucket-name-${AWS::AccountId}-${AWS::Region}-1"

  CloudFrontDistribution1:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket1.RegionalDomainName
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


    this is the error.

2024-09-18 08:40:19 UTC+0530
voice-to-chat-model1
ROLLBACK_IN_PROGRESS
-
Validation failed for following resources: [ConnectContactFlowModule1]. Rollback requested by user.
2024-09-18 08:40:19 UTC+0530
ConnectContactFlowModule1
CREATE_FAILED
VALIDATION_FAILED
Properties validation failed for resource ConnectContactFlowModule1 with message: [#/Content: expected type: String, found: JSONObject]

this is the content

{
  "Content": "{\"Version\":\"2019-10-30\",\"StartAction\":\"1ff34355-4c6a-42fb-8e71-627d4ffcde6a\",\"Metadata\":{\"entryPointPosition\":{\"x\":1114.4,\"y\":41.6},\"ActionMetadata\":{\"c3d3116b-4833-414d-85c7-54d7ba28ce0a\":{\"position\":{\"x\":3432.8,\"y\":5.6}},\"51925f2b-42d6-4172-8dcc-c794be502eff\":{\"position\":{\"x\":3142.4,\"y\":-166.4}},\"a4893b51-4ae1-44ba-8127-0ad84b24d220\":{\"position\":{\"x\":4043.2,\"y\":12}},\"053786fc-1a9d-49bb-9f3b-0615313e7475\":{\"position\":{\"x\":2664.8,\"y\":-164},\"parameters\":{\"LambdaFunctionARN\":{\"displayName\":\"Voice-to-chat-transfer\"}},\"dynamicMetadata\":{\"check\":false}},\"a403434c-d7b9-4cd6-80c3-ce76d77112ea\":{\"position\":{\"x\":1862.4,\"y\":4.8}},\"1ff34355-4c6a-42fb-8e71-627d4ffcde6a\":{\"position\":{\"x\":1432.8,\"y\":13.6}},\"fbd09b5a-c04e-46c9-900f-3bcbfb693913\":{\"position\":{\"x\":2665.6,\"y\":330.4}},\"4750120e-10b0-4cd8-92af-664d52233b80\":{\"position\":{\"x\":3153.6,\"y\":368.8}},\"24d5690d-cdfc-4e17-a84f-d018629c7cf8\":{\"position\":{\"x\":3149.6,\"y\":103.2}},\"3b2ac413-3ab7-4702-8545-8d4e416da148\":{\"position\":{\"x\":2269.6,\"y\":-42.4},\"conditionMetadata\":[{\"id\":\"35191358-4edb-40f8-957e-19d88bc0f5c5\",\"value\":\"1\"},{\"id\":\"3499b595-d904-45d9-a6a8-8f5140d7ad4f\",\"value\":\"2\"}]},\"3de54805-ed88-465a-b9d7-ced52cd08303\":{\"position\":{\"x\":2676,\"y\":100.8},\"parameters\":{\"LambdaFunctionARN\":{\"displayName\":\"Voice-to-chat-transfer\"}},\"dynamicMetadata\":{\"check\":false}}},\"Annotations\":[],\"name\":\"voice to chat-Module\",\"description\":\"\",\"status\":\"published\",\"hash\":{}},\"Actions\":[{\"Parameters\":{\"Text\":\"lambda error\"},\"Identifier\":\"c3d3116b-4833-414d-85c7-54d7ba28ce0a\",\"Type\":\"MessageParticipant\",\"Transitions\":{\"NextAction\":\"a4893b51-4ae1-44ba-8127-0ad84b24d220\",\"Errors\":[{\"NextAction\":\"a4893b51-4ae1-44ba-8127-0ad84b24d220\",\"ErrorType\":\"NoMatchingError\"}]}},{\"Parameters\":{\"Text\":\"You will receive a chat bot link for the chat channel to your registered Email. Please attempt to click the link so that you can use the chatbot.\\nThank you for calling have a nice day.\"},\"Identifier\":\"51925f2b-42d6-4172-8dcc-c794be502eff\",\"Type\":\"MessageParticipant\",\"Transitions\":{\"NextAction\":\"a4893b51-4ae1-44ba-8127-0ad84b24d220\",\"Errors\":[{\"NextAction\":\"c3d3116b-4833-414d-85c7-54d7ba28ce0a\",\"ErrorType\":\"NoMatchingError\"}]}},{\"Parameters\":{},\"Identifier\":\"a4893b51-4ae1-44ba-8127-0ad84b24d220\",\"Type\":\"DisconnectParticipant\",\"Transitions\":{}},{\"Parameters\":{\"LambdaFunctionARN\":\"arn:aws:lambda:us-east-1:768637739934:function:Voice-to-chat-transfer\",\"InvocationTimeLimitSeconds\":\"3\",\"LambdaInvocationAttributes\":{\"check\":\"email\"},\"ResponseValidation\":{\"ResponseType\":\"STRING_MAP\"}},\"Identifier\":\"053786fc-1a9d-49bb-9f3b-0615313e7475\",\"Type\":\"InvokeLambdaFunction\",\"Transitions\":{\"NextAction\":\"51925f2b-42d6-4172-8dcc-c794be502eff\",\"Errors\":[{\"NextAction\":\"a4893b51-4ae1-44ba-8127-0ad84b24d220\",\"ErrorType\":\"NoMatchingError\"}]}},{\"Parameters\":{\"RecordingBehavior\":{\"RecordedParticipants\":[\"Agent\",\"Customer\"]},\"AnalyticsBehavior\":{\"Enabled\":\"True\",\"AnalyticsLanguage\":\"en-US\",\"AnalyticsRedactionBehavior\":\"Disabled\",\"AnalyticsRedactionResults\":\"RedactedAndOriginal\",\"ChannelConfiguration\":{\"Chat\":{\"AnalyticsModes\":[]},\"Voice\":{\"AnalyticsModes\":[\"PostContact\"]}}}},\"Identifier\":\"a403434c-d7b9-4cd6-80c3-ce76d77112ea\",\"Type\":\"UpdateContactRecordingBehavior\",\"Transitions\":{\"NextAction\":\"3b2ac413-3ab7-4702-8545-8d4e416da148\"}},{\"Parameters\":{\"FlowLoggingBehavior\":\"Enabled\"},\"Identifier\":\"1ff34355-4c6a-42fb-8e71-627d4ffcde6a\",\"Type\":\"UpdateFlowLoggingBehavior\",\"Transitions\":{\"NextAction\":\"a403434c-d7b9-4cd6-80c3-ce76d77112ea\"}},{\"Parameters\":{\"Text\":\"error\"},\"Identifier\":\"fbd09b5a-c04e-46c9-900f-3bcbfb693913\",\"Type\":\"MessageParticipant\",\"Transitions\":{\"NextAction\":\"4750120e-10b0-4cd8-92af-664d52233b80\",\"Errors\":[{\"NextAction\":\"4750120e-10b0-4cd8-92af-664d52233b80\",\"ErrorType\":\"NoMatchingError\"}]}},{\"Parameters\":{},\"Identifier\":\"4750120e-10b0-4cd8-92af-664d52233b80\",\"Type\":\"DisconnectParticipant\",\"Transitions\":{}},{\"Parameters\":{\"Text\":\"You will receive a chat bot link for the chat channel on your mobile device through SMS. Please attempt to click the link so that you can use the chatbot.Thank you for calling have a nice day.\"},\"Identifier\":\"24d5690d-cdfc-4e17-a84f-d018629c7cf8\",\"Type\":\"MessageParticipant\",\"Transitions\":{\"NextAction\":\"a4893b51-4ae1-44ba-8127-0ad84b24d220\",\"Errors\":[{\"NextAction\":\"c3d3116b-4833-414d-85c7-54d7ba28ce0a\",\"ErrorType\":\"NoMatchingError\"}]}},{\"Parameters\":{\"Text\":\"You can choose to receive Email Or SMS Texts please select your preference to send the Chat Link to an Email please Press 1 and to send it to a Mobile device Press 2 .\",\"StoreInput\":\"False\",\"InputTimeLimitSeconds\":\"5\"},\"Identifier\":\"3b2ac413-3ab7-4702-8545-8d4e416da148\",\"Type\":\"GetParticipantInput\",\"Transitions\":{\"NextAction\":\"fbd09b5a-c04e-46c9-900f-3bcbfb693913\",\"Conditions\":[{\"NextAction\":\"053786fc-1a9d-49bb-9f3b-0615313e7475\",\"Condition\":{\"Operator\":\"Equals\",\"Operands\":[\"1\"]}},{\"NextAction\":\"3de54805-ed88-465a-b9d7-ced52cd08303\",\"Condition\":{\"Operator\":\"Equals\",\"Operands\":[\"2\"]}},],\"Errors\":[{\"NextAction\":\"fbd09b5a-c04e-46c9-900f-3bcbfb693913\",\"ErrorType\":\"InputTimeLimitExceeded\"},{\"NextAction\":\"fbd09b5a-c04e-46c9-900f-3bcbfb693913\",\"ErrorType\":\"NoMatchingCondition\"},{\"NextAction\":\"fbd09b5a-c04e-46c9-900f-3bcbfb693913\",\"ErrorType\":\"NoMatchingError\"}]}},{\"Parameters\":{\"LambdaFunctionARN\":\"arn:aws:lambda:us-east-1:768637739934:function:Voice-to-chat-transfer\",\"InvocationTimeLimitSeconds\":\"3\",\"LambdaInvocationAttributes\":{\"check\":\"mobile\"},\"ResponseValidation\":{\"ResponseType\":\"STRING_MAP\"}},\"Identifier\":\"3de54805-ed88-465a-b9d7-ced52cd08303\",\"Type\":\"InvokeLambdaFunction\",\"Transitions\":{\"NextAction\":\"24d5690d-cdfc-4e17-a84f-d018629c7cf8\",\"Errors\":[{\"NextAction\":\"4750120e-10b0-4cd8-92af-664d52233b80\",\"ErrorType\":\"NoMatchingError\"}]}},{\"Parameters\":{},\"Identifier\":\"Settings\",\"Type\":\"Settings\",\"Transitions\":[{\"DisplayName\":\"Success\",\"ReferenceName\":\"Success\",\"Description\":\"\"},{\"DisplayName\":\"Error\",\"ReferenceName\":\"Error\",\"Description\":\"\"}]}]}"
}

