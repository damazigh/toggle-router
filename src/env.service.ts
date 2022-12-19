import { ConflictException, Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { CommonService } from './common.service';
import { EnvCommand } from './db/command/impl/env.command';
import { GlobalSecondaryIndexes, SupportedAppliesTo, SupportedEnvType, TABLE_NAME } from './enum/constant';
import { EnvEntityService } from './env-entity.service';
import { CreateEnvEntity } from './inout/in/create-env-entity.model';
import { CreateEnv } from './inout/in/create_env';
import { FilterEnv } from './inout/in/filter_env';
import { UpdateEnv } from './inout/in/update_env';
import { CreateEnvOutput } from './inout/out/create_env_output';
import { EnvOutput } from './inout/out/env_output';
import { HistoryOutput } from './inout/out/history_output';
import { ToggleOutput } from './inout/out/toggle_output';

@Injectable()
export class EnvService {

  constructor(
    private commonService: CommonService,
    private envEntityService: EnvEntityService
    ) {}
  
  public async create(createEnv: CreateEnv) {
    const command = new EnvCommand(createEnv)
    command.validateForCreation();
    const createCommands = command.buildCreateCommandInputs();
    await command.create(createCommands, true);

    if (createEnv.entities) {
      const x = (await this.commonService.searchByPKAndSkBeginWith(`ENV#${createEnv.name}`, 'TOGGLE#'));
      const items = x.Items;
      if (items && items.length !== 1) {
        throw new ConflictException('Cannot determine one toggle to associate parameter with');
      }
      const item = items[0];
      const entities = createEnv.entities.map(e => CreateEnvEntity.fromLight(e, item.SK));
      await this.envEntityService.create(entities);
    }
    return new CreateEnvOutput(`ENV#${createEnv.name}`, command.toggleSortKey);
  }

  public async update(updateEnv: UpdateEnv) {
    const command = new EnvCommand(updateEnv);
    command.validateForUpdate();

    const updateCommands = command.buildUpdateCommandInputs();
    await command.update(updateCommands, true);
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

  public async getEnvV2(name: string, appliesTo: SupportedAppliesTo) {
    const filterEnv = new FilterEnv();
    filterEnv.name = name;
    filterEnv.appliesTo = appliesTo;

    let items = null;

    const key = `ENV#${name}`;

    for (let val of [appliesTo, SupportedAppliesTo.ALL]) {
      const sk = `${key}#${val}`;
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :PK and SK = :SK",
        ExpressionAttributeValues: {
          ':PK': key,
          ':SK': sk
        }
      };
      items = (await this.commonService.search(params)).Items;
      if (items && items.length > 0) {
        break;
      }
    }

    const res = items[0];
    if (res.envType === SupportedEnvType.TOGGLE) {
      // then fetch toggle
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :PK and begins_with(#SK, :startsWith)",
        ExpressionAttributeValues: {
          ':PK': key,
          ':startsWith': 'TOGGLE',
        },
        ExpressionAttributeNames: {
          '#SK': 'SK'
        }
      };
      const toggles = (await this.commonService.search(params)).Items
      if (toggles && toggles.length > 0) {
        res.toggle = toggles[0];
      }
    }
    return res;
  }

  public async allByAppliesTo(appliesTo: SupportedAppliesTo) {
    let items = [];
    for(let applyTo of [appliesTo, SupportedAppliesTo.ALL]) {
      const params = {
        TableName: TABLE_NAME,
        IndexName: GlobalSecondaryIndexes.APPLIES_TO_INDEX,
        KeyConditionExpression: "appliesTo = :PK",
        ExpressionAttributeValues: {
          ':PK': applyTo,
        }
      };
      items = [...items, ...(await this.commonService.search(params)).Items]
    }
    return items;
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

