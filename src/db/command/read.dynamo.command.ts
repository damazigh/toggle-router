import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";

export interface ReadDynamoCommand {
    buildQueryCommandInputs(opts?): QueryCommandInput | QueryCommandInput[];
}