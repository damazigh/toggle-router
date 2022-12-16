import { PutCommandInput } from "@aws-sdk/lib-dynamodb";

export interface CreateDynamoCommand {
  buildCreateCommandInputs(opts?): PutCommandInput | PutCommandInput[];
}