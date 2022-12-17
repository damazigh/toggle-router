import { Injectable } from '@nestjs/common';
import { EnvCommand } from './db/command/impl/env.command';
import { CreateEnv } from './inout/in/create_env';
import { GetEnv } from './inout/in/get_env';
import { EnvVariableItem } from './inout/out/env_variable_item';

@Injectable()
export class EnvService {
  
  public async create(createEnv: CreateEnv): Promise<any> {
    const command = new EnvCommand(createEnv)
    command.validateForCreation();
    const createCommands = command.buildCreateCommandInputs();
    return await command.create(createCommands, true);
  }

  public async all() {
    const command = new EnvCommand(null);
    const queryCommands = command.buildQueryCommandInputs();
    let items = (await command.query(queryCommands)).flat();
    return items.map((item) => new EnvVariableItem(item)).sort((a, b) => b.createdAt - a.createdAt);
  }

  public async getEnv(getEnv: GetEnv): Promise<any> {
    const command = new EnvCommand(getEnv);
    command.validateForGet();
    const getCommand = command.buildGetCommandInput();
    let item = await command.read(getCommand);
    return new EnvVariableItem(item);
  }

}
