import { Injectable } from '@nestjs/common';
import { EnvCommand } from './db/command/impl/env.command';
import { CreateEnv } from './inout/in/create_env';
import { GetEnv } from './inout/in/get_env';
import { EnvOutput } from './inout/out/env_output';
import { ToggleOutput } from './inout/out/toggle_output';

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

    // distinguish between envs and toggles
    var envs = [];
    var toggles = {};
    items.forEach((item) => {
      if (item.toggleType != null) {
        toggles[item.PK] = new ToggleOutput(item);
      } else {
        envs.push(item);
      }
    });

    // map for output, and sort by creation date
    return envs.map((env) => new EnvOutput(env, toggles[env.PK])).sort((a, b) => b.createdAt - a.createdAt);
  }

  public async getEnv(getEnv: GetEnv) {
    const command = new EnvCommand(getEnv);
    command.validateForGet();
    const getCommand = command.buildGetCommandInput();
    let item = await command.read(getCommand);
    return item ? new EnvOutput(item) : {};
  }

}
