const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
// Function to create the DynamoDB table
async function createTable() {
  const params = {
      TableName: 'MetricData',
      KeySchema: [
          { AttributeName: 'metricType', KeyType: 'HASH' },  // Partition key
          { AttributeName: 'date', KeyType: 'RANGE' },       // Sort key
      ],
      AttributeDefinitions: [
          { AttributeName: 'metricType', AttributeType: 'S' },
          { AttributeName: 'date', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
      },
  };
