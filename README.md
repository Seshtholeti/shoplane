{
    "eventVersion": "1.09",
    "userIdentity": {
        "type": "AssumedRole",
        "principalId": "AROA3F5TBEOPFEATISW3M:CustomerCallMetricsLogger",
        "arn": "arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger",
        "accountId": "768637739934",
        "accessKeyId": "ASIA3F5TBEOPP4WAY6DJ",
        "sessionContext": {
            "sessionIssuer": {
                "type": "Role",
                "principalId": "AROA3F5TBEOPFEATISW3M",
                "arn": "arn:aws:iam::768637739934:role/service-role/CustomerCallMetricsLogger-role-eb56n0ad",
                "accountId": "768637739934",
                "userName": "CustomerCallMetricsLogger-role-eb56n0ad"
            },
            "attributes": {
                "creationDate": "2024-11-28T09:10:49Z",
                "mfaAuthenticated": "false"
            }
        }
    },
    "eventTime": "2024-11-28T09:15:24Z",
    "eventSource": "connect.amazonaws.com",
    "eventName": "GetMetricDataV2",
    "awsRegion": "us-east-1",
    "sourceIPAddress": "3.239.93.222",
    "userAgent": "aws-sdk-js/3.632.0 ua/2.0 os/linux#5.10.227-239.884.amzn2.x86_64 lang/js md/nodejs#20.18.0 api/connect#3.632.0 exec-env/AWS_Lambda_nodejs20.x",
    "requestParameters": {
        "ResourceArn": "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21",
        "Filters": [
            {
                "FilterKey": "QUEUE",
                "FilterValues": [
                    "f8c742b9-b5ef-4948-8bbf-9a33c892023f"
                ]
            }
        ],
        "Metrics": [
            {
                "Name": "CONTACTS_HANDLED"
            },
            {
                "Name": "CONTACTS_ABANDONED"
            }
        ],
        "EndTime": 1732751999,
        "Groupings": [
            "QUEUE"
        ],
        "StartTime": 1732665600,
        "Interval": {
            "IntervalPeriod": "DAY"
        }
    },
    "responseElements": {
        "MetricResults": [
            {
                "Dimensions": {
                    "QUEUE": "f8c742b9-b5ef-4948-8bbf-9a33c892023f",
                    "QUEUE_ARN": "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/queue/f8c742b9-b5ef-4948-8bbf-9a33c892023f"
                },
                "MetricInterval": {
                    "Interval": "DAY",
                    "StartTime": 1732665600,
                    "EndTime": 1732751999
                },
                "Collections": [
                    {
                        "Metric": {
                            "Name": "CONTACTS_HANDLED"
                        },
                        "Value": 2
                    },
                    {
                        "Metric": {
                            "Name": "CONTACTS_ABANDONED"
                        },
                        "Value": 3
                    }
                ]
            }
        ]
    },
    "requestID": "b8c127f3-565b-4cc8-a278-c6f95e43c81b",
    "eventID": "cd7d7843-3121-47c6-9f94-845f6e0b53a8",
    "readOnly": false,
    "eventType": "AwsApiCall",
    "managementEvent": true,
    "recipientAccountId": "768637739934",
    "eventCategory": "Management"
}

This is for GetMetricDataV2
