import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";

export interface ReadDynamoCommand {
    buildReadCommandInput(opts?): QueryCommandInput;
}