import { Injectable } from '@nestjs/common';
import { EnvCommand } from './db/command/impl/env.command';
import { CreateEnv } from './db/model/create_env';
import { EnvVariableItem } from './db/model/env_variable_item';
import { GetEnv } from './db/model/get_env';

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
