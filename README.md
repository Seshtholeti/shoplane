Response
{
  "statusCode": 500,
  "body": "{\"error\":\"No phone numbers found in the CSV file.\",\"details\":\"Error: No phone numbers found in the CSV file.\\n    at Runtime.handler (file:///var/task/index.mjs:38:12)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\"}"
}

Function Logs
START RequestId: 1e40e92f-ab5b-4e52-833c-030bbe4d87b5 Version: $LATEST
2024-11-20T11:44:54.781Z	1e40e92f-ab5b-4e52-833c-030bbe4d87b5	INFO	Row parsed: { 'Name;PhoneNumber': 'Mohan;919949921498' }
2024-11-20T11:44:54.840Z	1e40e92f-ab5b-4e52-833c-030bbe4d87b5	INFO	Row Keys: [ 'Name;PhoneNumber' ]
2024-11-20T11:44:54.840Z	1e40e92f-ab5b-4e52-833c-030bbe4d87b5	INFO	Row parsed: { 'Name;PhoneNumber': 'Seshu;918639694701' }
2024-11-20T11:44:54.840Z	1e40e92f-ab5b-4e52-833c-030bbe4d87b5	INFO	Row Keys: [ 'Name;PhoneNumber' ]
2024-11-20T11:44:54.842Z	1e40e92f-ab5b-4e52-833c-030bbe4d87b5	ERROR	Error processing the Lambda function: Error: No phone numbers found in the CSV file.
    at Runtime.handler (file:///var/task/index.mjs:38:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
END RequestId: 1e40e92f-ab5b-4e52-833c-030bbe4d87b5
REPORT RequestId: 1e40e92f-ab5b-4e52-833c-030bbe4d87b5	Duration: 1129.93 ms	Billed Duration: 1130 ms	Memory Size: 128 MB	Max Memory Used: 96 MB	Init Dur
