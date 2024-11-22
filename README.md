START RequestId: 38811071-0ab9-4a77-b051-edc07b8dc6f4 Version: $LATEST
2024-11-22T04:09:45.136Z	38811071-0ab9-4a77-b051-edc07b8dc6f4	INFO	Phone numbers parsed and formatted: [ '+919949921498', '+918639694701' ]
2024-11-22T04:09:45.474Z	38811071-0ab9-4a77-b051-edc07b8dc6f4	INFO	Metrics Data: {"$metadata":{"httpStatusCode":200,"requestId":"61d69e97-9af9-47b5-8729-877f74cbbb72","attempts":1,"totalRetryDelay":0},"MetricResults":[{"Collections":[{"Metric":{"Name":"CONTACTS_HANDLED"},"Value":0},{"Metric":{"Name":"CONTACTS_ABANDONED"},"Value":6}],"Dimensions":{},"MetricInterval":{"EndTime":"2024-11-21T23:59:59.000Z","Interval":"DAY","StartTime":"2024-11-21T00:00:00.000Z"}},{"Collections":[{"Metric":{"Name":"CONTACTS_HANDLED"},"Value":8},{"Metric":{"Name":"CONTACTS_ABANDONED"},"Value":0}],"Dimensions":{"AGENT":"9783145b-f6e4-4d42-9414-eb8943c0d9aa","AGENT_ARN":"arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/agent/9783145b-f6e4-4d42-9414-eb8943c0d9aa"},"MetricInterval":{"EndTime":"2024-11-21T23:59:59.000Z","Interval":"DAY","StartTime":"2024-11-21T00:00:00.000Z"}},{"Collections":[{"Metric":{"Name":"CONTACTS_HANDLED"},"Value":2},{"Metric":{"Name":"CONTACTS_ABANDONED"},"Value":0}],"Dimensions":{"AGENT":"d08cd6b0-6a47-4783-8ddf-137186cd9b1f","AGENT_ARN":"arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/agent/d08cd6b0-6a47-4783-8ddf-137186cd9b1f"},"MetricInterval":{"EndTime":"2024-11-21T23:59:59.000Z","Interval":"DAY","StartTime":"2024-11-21T00:00:00.000Z"}}]}
2024-11-22T04:09:45.474Z	38811071-0ab9-4a77-b051-edc07b8dc6f4	INFO	Handled Contacts: []
2024-11-22T04:09:45.474Z	38811071-0ab9-4a77-b051-edc07b8dc6f4	INFO	Handled Contact Agent Details: []
2024-11-22T04:09:45.474Z	38811071-0ab9-4a77-b051-edc07b8dc6f4	INFO	Abandoned Contacts: []
2024-11-22T04:09:45.474Z	38811071-0ab9-4a77-b051-edc07b8dc6f4	INFO	Abandoned Contact Agent Details: []
END RequestId: 38811071-0ab9-4a77-b051-edc07b8dc6f4
REPORT RequestId: 38811071-0ab9-4a77-b051-edc07b8dc6f4	Duration: 1401.33 ms	Billed Duration: 1402 ms	Memory Size: 128 MB


I am getting the details in function flogs.

Metric results>collections>...
please check that array and assign to our variables respectively
