import { Injectable } from '@nestjs/common';
import { EnvEntityCommand } from './db/command/impl/env-entity.command';
import { CreateEnvEntity } from './db/model/create-env-entity.model';
import client from './db/client';

@Injectable()
export class EnvEntityService {

  async create(createEnvEntity: CreateEnvEntity[]) {
    const commandWrapper = new EnvEntityCommand(createEnvEntity);
    commandWrapper.validateForCreation();
    const command = commandWrapper.buildBatchWriteCommandInput();
    return await commandWrapper.createBatch(command)
  }
}
