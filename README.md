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
