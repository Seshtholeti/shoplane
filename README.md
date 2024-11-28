{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "connect:GetMetricDataV2",
        "connect:DescribeInstance",
        "connect:ListQueues",
        "connect:ListUsers",
        "connect:GetCurrentMetricData",
        "connect:GetContactAttributes"
      ],
      "Resource": [
        "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21",
        "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/queue/*",
        "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/contact/*"
      ]
    },
    {
      "Effect": "Deny",
      "Action": "connect:*",
      "Resource": "*",
      "Condition": {
        "StringNotEqualsIfExists": {
          "aws:RequestedRegion": "us-east-1"
        }
      }
    }
  ]
}