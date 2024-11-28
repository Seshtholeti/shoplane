{
  "Effect": "Allow",
  "Action": [
    "connect:GetMetricDataV2",
    "connect:DescribeInstance",
    "connect:ListQueues"
  ],
  "Resource": [
    "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21",
    "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/queue/*"
  ]
}