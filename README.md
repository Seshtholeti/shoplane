AWSTemplateFormatVersion: 2010-09-09
Description: Specifies a flow for an Amazon Connect instance
Resources:
  Flow:
    Type: 'AWS::Connect::ContactFlow'
    Properties:
      Name: ExampleFlow
      Description: flow created using cfn
      InstanceArn: arn:aws:connect:region-name:aws-account-id:instance/instance-arn
      Type: CONTACT_FLOW
      Content: ExampleFlow content(JSON) using Amazon Connect Flow Language.
      Tags:
        - Key: testkey
          Value: testValue
