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
