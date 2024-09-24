AWSTemplateFormatVersion: 2010-09-09
Description: Template for Voice-To-Chat Solution Module
Parameters:
  ConnectInstanceArn:
    Type: String
    Description: ARN of the Amazon Connect instance
  LambdaExecutionRole:
    Type: String
    Description: IAM role ARN for Lambda execution
  EmailIdentityArn:
    Type: String
    Description: ARN of the email identity for Pinpoint
  # ContactFlowS3Bucket:
  #   Type: String
  #   Description: S3 bucket name where the contact flow is stored
  # ContactFlowS3Key:
  #   Type: String
  #   Description: S3 key for the contact flow file
Resources:
  # Contact Flow Module Resource
  ConnectContactFlow:
    Type: AWS::Connect::ContactFlowModule
    Properties:
      InstanceArn: !Ref ConnectInstanceArn
      Name: VoiceToChatFlowModule

      Fn::Transform:
        Name: "AWS::Include"
        Parameters:
          Location: s3://v2chat-json/vchat.json
  # Lambda Function Resource
  VoiceToChatLambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: VoiceToChatTransferFunction
      Handler: index.handler
      Role: !Ref LambdaExecutionRole
      Code:
        S3Bucket: voice-to-chat-lambda-solution
        S3Key: Voice-to-chat-transfer-2b6ec221-f880-43a1-af57-544ebd835c7b.zip
      Runtime: python3.10
      Timeout: 15
  # Pinpoint Application Resource
  PinpointApp:
    Type: AWS::Pinpoint::App
    Properties:
      Name: VoiceToChatApp
  # Pinpoint Email Channel Resource
  PinpointEmailChannel:
    Type: AWS::Pinpoint::EmailChannel
    Properties:
      ApplicationId: !Ref PinpointApp
      FromAddress: ati.pat85@outlook.com
      Identity: !Ref EmailIdentityArn
      RoleArn: !Ref LambdaExecutionRole
  # S3 Bucket Resource for storage
  S3BucketForContactFlows:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name-voice-to-chat
  # CloudFront Distribution Resource for serving content securely
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
Outputs:
  ConnectContactFlowModuleId:
    Description: "Connect contact flow module ID"
    Value: !Ref ConnectContactFlowModule
  LambdaFunctionArn:
    Description: "Lambda function ARN"
    Value: !GetAtt VoiceToChatLambdaFunction.Arn
  PinpointAppId:
    Description: "Pinpoint app ID"
    Value: !Ref PinpointApp
  S3BucketName:
    Description: "S3 bucket name for contact flows"
    Value: !Ref S3BucketForContactFlows
  CloudFrontDistributionId:
    Description: "CloudFront distribution ID"
    Value: !Ref CloudFrontDistribution


above one is the template and below is the error while uploading
	
Unresolved resource dependencies [ConnectContactFlowModule] in the Outputs block of the template. Rollback requested by user.
2024-09-24 18:14:26 UTC+0530
voice-to-chat-model1
CREATE_IN_PROGRESS
-
Unresolved resource dependencies [ConnectContactFlowModule] in the Outputs block of the template
