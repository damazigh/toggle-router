import { BatchWriteCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { GlobalSecondaryIndexes, MAX_CREATED_ENTITY_PER_REQUEST, SupportedEntities, TABLE_NAME } from "src/enum/constant";
import { CreateEnvEntity } from "src/inout/in/create-env-entity.model";
import { GetEnvEntities } from "src/inout/in/get_env_entities";
import { Validator } from "src/util/validator";
import { AbstractDynamoCommand } from "../abstract.command";
import { BatchWriteDynamoCommand } from "../batch-write.dynamo.command";

export class EnvEntityCommand extends AbstractDynamoCommand implements BatchWriteDynamoCommand {
  private createObject: CreateEnvEntity[];
  private getObject: GetEnvEntities;

  constructor(private object: CreateEnvEntity[] | GetEnvEntities) {
    super();
    this.createObject = object as CreateEnvEntity[];
    this.getObject = object as GetEnvEntities;
  }

  public validateForCreation() {
    const arr = this.createObject as CreateEnvEntity[];
    Validator.maxLength(arr, MAX_CREATED_ENTITY_PER_REQUEST);
    arr.forEach(data => {
      Validator.require(data, 'entityType');
      Validator.require(data, 'entityId');
      Validator.require(data, 'value');
      Validator.require(data, 'toggleSortKey');
      Validator.isInEnum(data, 'entityType', SupportedEntities);
    });
  }

  buildBatchWriteCommandInput(): BatchWriteCommandInput {
    const arr = this.createObject as CreateEnvEntity[];

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
            entityType: data.entityType,
            entityId: data.entityId
          }
        }
      }
    });

    params.RequestItems[TABLE_NAME] = items;
    return params;
  }


  public validateForQuery() {
    Validator.require(this.getObject, 'toggleKey');
  }

  buildQueryCommands(): QueryCommandInput[] {
    var commands = [];
    commands.push({
      TableName: TABLE_NAME,
      IndexName: GlobalSecondaryIndexes.INVERTED_INDEX,
      KeyConditionExpression: "SK = :sk",
      FilterExpression: "attribute_not_exists(toggleType) or toggleType = :nullValue",
      ExpressionAttributeValues: {
        ":sk": this.getObject.toggleKey,
        ":nullValue": null
      }
    })
    return commands;
  }

}