import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localstack:4566'
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export default docClient;