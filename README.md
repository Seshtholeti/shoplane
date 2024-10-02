  # Lambda and Amazon Connect Integration
  ConnectLambdaAssociation:
    Type: AWS::Connect::InstanceLambdaFunctionAssociation
    Properties: 
      InstanceArn: !Ref ConnectInstanceArn
      FunctionArn: !GetAtt VoiceToChatLambdaFunction.Arn
      FunctionName: !Ref LambdaFunctionName
      TriggerEventSource: CONTACT_FLOW  # This is the event that triggers the Lambda function