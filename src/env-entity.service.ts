import { Injectable } from '@nestjs/common';
import { EnvEntityCommand } from './db/command/impl/env-entity.command';
import { CreateEnvEntity } from './inout/in/create-env-entity.model';
import { GetEnvEntities } from './inout/in/get_env_entities';
import { EnvEntityOutput } from './inout/out/env_entity_output';

@Injectable()
export class EnvEntityService {

  async create(createEnvEntity: CreateEnvEntity[]) {
    const commandWrapper = new EnvEntityCommand(createEnvEntity);
    commandWrapper.validateForCreation();
    const command = commandWrapper.buildBatchWriteCommandInput();
    return await commandWrapper.createBatch(command)
  }

  async getEnvEntities(getEnvEntities: GetEnvEntities) {
    const commandWrapper = new EnvEntityCommand(getEnvEntities);
    commandWrapper.validateForQuery();
    const queryCommands = commandWrapper.buildQueryCommands();
    let items = (await commandWrapper.query(queryCommands)).flat();
    return items.map((item) => new EnvEntityOutput(item));
  }

}
