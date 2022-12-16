import { Injectable } from '@nestjs/common';
import { CreateEnv } from './db/model/create_env';

import { EnvCommand } from './db/command/impl/env.command';

@Injectable()
export class EnvService {
  
  public async create(createEnv: CreateEnv): Promise<any>{
    const command = new EnvCommand(createEnv)
    command.validateForCreation();
    const createCommands = command.buildCreateCommandInputs();
    return await command.create(createCommands, true);
  }
}
