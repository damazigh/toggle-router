import { Injectable } from '@nestjs/common';
import { EnvCommand } from './db/command/impl/env.command';
import { CreateEnv } from './inout/in/create_env';
import { EnvVariableItem } from './inout/out/env_variable_item';

@Injectable()
export class EnvService {
  
  public async create(createEnv: CreateEnv): Promise<any> {
    const command = new EnvCommand(createEnv)
    command.validateForCreation();
    const createCommands = command.buildCreateCommandInputs();
    return await command.create(createCommands, true);
  }

  public async getItem(pk: string): Promise<any> {
  
  }

  public async all() {
    const command = new EnvCommand(null);
    const readCommands = command.buildReadCommandInputs();
    let items = (await command.read(readCommands)).flat();
    return items.map((item) => new EnvVariableItem(item)).sort((a, b) => b.createdAt - a.createdAt);
  }

}
