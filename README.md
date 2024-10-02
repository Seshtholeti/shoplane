can not read a block mapping entry; a multiline key may not be an implicit key (78:27)

 75 |       LambdaFunctionAssociations:
 76 |         - LambdaArn: !GetAtt MyLambdaFunction.Arn
 77 |   Contact Flow Module for Amazon Connect
 78 |   ConnectContactFlowModule:
--------------------------------^
 79 |     Type: AWS::Connect::ContactFlowModule
 80 |     Properties:
