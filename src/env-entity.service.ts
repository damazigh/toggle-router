import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ConflictException, Injectable } from '@nestjs/common';
import { CommonService } from './common.service';
import { EnvEntityCommand } from './db/command/impl/env-entity.command';
import { SupportedAppliesTo, SupportedEntities, TABLE_NAME } from './enum/constant';
import { CreateEnvEntity } from './inout/in/create-env-entity.model';
import { GetEnvEntities } from './inout/in/get_env_entities';
import { EnvEntityOutput } from './inout/out/env_entity_output';

@Injectable()
export class EnvEntityService {

  constructor(
    private commonService: CommonService,
  ) {}

  async create(createEnvEntity: CreateEnvEntity[]) {
    const commandWrapper = new EnvEntityCommand(createEnvEntity);
    commandWrapper.validateForCreation();

    // get the env name
    const x = (await this.commonService.searchBySKAndPKBeginWith(createEnvEntity[0].toggleSortKey, "ENV#"));
    const items = x.Items;
    if (items && items.length !== 1) {
      throw new ConflictException('Cannot determine one toggle to associate parameter with');
    }
    const item = items[0];

    const command = commandWrapper.buildBatchWriteCommandInput({ envName: item.name });
    return await commandWrapper.createBatch(command)
  }

  async getEnvEntities(getEnvEntities: GetEnvEntities) {
    const commandWrapper = new EnvEntityCommand(getEnvEntities);
    commandWrapper.validateForQuery();
    const queryCommands = commandWrapper.buildQueryCommands();
    let items = (await commandWrapper.query(queryCommands)).flat();
    return items.map((item) => new EnvEntityOutput(item));
  }

  async getOne(entityId: string, type: string, name: string) {
    const key = `${type.toUpperCase()}#${entityId}`

    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK",
      FilterExpression: "#NAME = :name",
      ExpressionAttributeValues: {
        ":PK": key,
        ":name": name
      },
      ExpressionAttributeNames: {
        '#NAME': 'name'
      }
    };
    return (await this.commonService.search(params)).Items[0];
  }

}
