import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { doc } from 'prettier';

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localstack:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);
docClient.middlewareStack.addRelativeTo(
  (next) => async (args) => {
    console.log("pre-marshall", args.input);
    return next(args);
  },
  {
    relation: "before",
    toMiddleware: "DocumentMarshall",
  }
);
docClient.middlewareStack.addRelativeTo(
  (next) => async (args) => {
    console.log("post-marshall", args.input);
    return next(args);
  },
  {
    relation: "after",
    toMiddleware: "DocumentMarshall",
  }
);
export default docClient;