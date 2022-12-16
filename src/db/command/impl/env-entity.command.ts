import { PutRequest, WriteRequest } from "@aws-sdk/client-dynamodb";
import {  BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { CreateEnvEntity } from "src/db/model/create-env-entity.model";
import { SupportedEntities, TABLE_NAME } from "src/enum/constant";
import { Validator } from "src/util/validator";
import { AbstractDynamoCommand } from "../abstract.command";
import { BatchWriteDynamoCommand } from "../batch-write.dynamo.command";

export class EnvEntityCommand extends AbstractDynamoCommand implements BatchWriteDynamoCommand {
  
  constructor(private object: CreateEnvEntity []) {
    super();
  }

  public validateForCreation() {
    const arr = this.object as CreateEnvEntity[];
    Validator.maxLength(arr, 15);
    arr.forEach(data => {
      Validator.require(data, 'entityType');
      Validator.require(data, 'entityId');
      Validator.require(data, 'value');
      Validator.require(data, 'toggleSortKey');
      Validator.isInEnum(data, 'entityType', SupportedEntities);
    });
  }

  buildBatchWriteCommandInput(): BatchWriteCommandInput {
    const arr = this.object as CreateEnvEntity[];

    const params = {
      RequestItems: {}
    }
    const items = arr.map(data => {
      return {
        PutRequest: {
          Item: {
            PK: `${data.entityType}#${data.entityId}`,
            SK: `${data.toggleSortKey}`,
            value: data.value,
          }
        }
      }
    });

    params.RequestItems[TABLE_NAME] = items;
    return params;
  }
}