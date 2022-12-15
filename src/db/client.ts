import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4588'
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export default docClient;