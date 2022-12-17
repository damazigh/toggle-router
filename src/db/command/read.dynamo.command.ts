import { GetCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";

export interface ReadDynamoCommand {
    buildGetCommandInput(opts?): GetCommandInput | GetCommandInput[];
    buildQueryCommandInputs(opts?): QueryCommandInput | QueryCommandInput[];
}