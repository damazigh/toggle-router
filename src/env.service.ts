import { Injectable } from '@nestjs/common';
import { EnvCommand } from './db/command/impl/env.command';
import { CreateEnv } from './inout/in/create_env';
import { FilterEnv } from './inout/in/filter_env';
import { CreateEnvOutput } from './inout/out/create_env_output';
import { EnvOutput } from './inout/out/env_output';
import { HistoryOutput } from './inout/out/history_output';
import { ToggleOutput } from './inout/out/toggle_output';

@Injectable()
export class EnvService {
  
  public async create(createEnv: CreateEnv) {
    const command = new EnvCommand(createEnv)
    command.validateForCreation();
    const createCommands = command.buildCreateCommandInputs();
    await command.create(createCommands, true);
    return new CreateEnvOutput(`ENV#${createEnv.name}`, command.toggleSortKey);
  }

  public async all() {
    const command = new EnvCommand(null);
    const queryCommands = command.buildQueryCommandInputs();
    let items = (await command.query(queryCommands)).flat();

    const [envs, toggles] = this.envAndToggles(items);
    return envs.map((env) => new EnvOutput(env, toggles[env.PK])).sort((a, b) => b.createdAt - a.createdAt);
  }

  public async getEnv(filterEnv: FilterEnv) {
    const command = new EnvCommand(filterEnv);
    command.validateForQueryOne();
    const queryCommand = command.buildQueryCommandInputs();
    let items = (await command.query(queryCommand)).flat();

    const [envs, toggles] = this.envAndToggles(items);
    const env = envs.length > 0 ? envs[0] : null;
    return env != null ? new EnvOutput(env, toggles[env.PK]) : {};
  }

  private envAndToggles(items: any): [any[], {}] {
    var envs = [];
    var toggles = {};
    items.forEach((item: any) => {
      if (item.toggleType != null) {
        toggles[item.PK] = new ToggleOutput(item);
      } else if (item.envType != null) {
        envs.push(item);
      }
    });
    return [envs, toggles];
  }


  public async getEnvHistory(filterEnv: FilterEnv) {
    const command = new EnvCommand(filterEnv);
    command.validateForQueryOne();
    const queryCommand = command.buildQueryCommandInputs();
    let items = (await command.query(queryCommand)).flat();
    let historyItems = items.filter((item) => item.changes != null);
    return historyItems.map((item) => new HistoryOutput(item));
  }

}
