import { BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";

export interface BatchWriteDynamoCommand {
  buildBatchWriteCommandInput(): BatchWriteCommandInput;
}