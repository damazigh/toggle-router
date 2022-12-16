import { Injectable } from '@nestjs/common';
import { EnvCommand } from './db/command/impl/env.command';
import { CreateEnv } from './db/env_variable/create_env';
import { GetEnv } from './db/env_variable/get_env';
import { EnvVariableItem } from './db/env_variable/env_variable_item';

@Injectable()
export class EnvService {
  
  public async create(createEnv: CreateEnv): Promise<any> {
    const command = new EnvCommand(createEnv)
    command.validateForCreation();
    const createCommands = command.buildCreateCommandInputs();
    return await command.create(createCommands, true);
  }

  public async all(getEnv: GetEnv) {
    const command = new EnvCommand(getEnv);
    command.validateForRead();
    const readCommand = command.buildReadCommandInput();
    let response = await command.read(readCommand);
    return response.Items.map((item) => new EnvVariableItem(item));
  }
}
