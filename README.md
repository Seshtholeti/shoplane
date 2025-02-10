Status: Succeeded
Test Event Name: Get

Response:
{
  "statusCode": 403,
  "body": "Forbidden"
}

Function Logs:
START RequestId: eded8d76-bf06-4b4c-9cf2-83d1996d88d9 Version: $LATEST
2025-02-10T08:03:19.987Z	eded8d76-bf06-4b4c-9cf2-83d1996d88d9	INFO	New Event: {
  "httpMethod": "GET",
  "queryStringParameters": {
    "hub.mode": "subscribe",
    "hub.verify_token": "your_verify_token",
    "hub.challenge": "123456789"
  }
}
2025-02-10T08:03:19.996Z	eded8d76-bf06-4b4c-9cf2-83d1996d88d9	ERROR	Webhook verification failed
END RequestId: eded8d76-bf06-4b4c-9cf2-83d1996d88d9
REPORT RequestId: eded8d76-bf06-4b4c-9cf2-83d1996d88d9	Duration: 30.10 ms	Billed Duration: 31 ms	Memory Size: 128 MB	Max Memory Used: 84 MB	Init Duration: 247.63 ms

Request ID: eded8d76-bf06-4b4c-9cf2-83d1996d88d9
