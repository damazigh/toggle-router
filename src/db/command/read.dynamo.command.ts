import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";

export interface ReadDynamoCommand {
    buildReadCommandInputs(opts?): QueryCommandInput | QueryCommandInput[];
}