import { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "src/enum/constant";

export interface Historisant {
  historizeCreate(item): Promise<any>;
  historizeUpdate(oldItem, newItem): Promise<any>;
}