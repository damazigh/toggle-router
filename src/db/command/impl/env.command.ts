import { PutCommandInput, QueryCommandInput, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { PreconditionFailedException, UnprocessableEntityException } from "@nestjs/common";
import { SupportedAppliesToForBasic, SupportedEnvType, TABLE_NAME, SupportedToggleType, GlobalSecondaryIndexes, SupportedAppliesTo, MAX_CREATED_ENTITY_PER_REQUEST } from "src/enum/constant";
import { Utils } from "src/util/utils";
import { uuid } from "uuidv4";
import { AbstractDynamoCommand } from "../abstract.command";
import { CreateDynamoCommand } from "../create.dynamo.command";
import { ReadDynamoCommand } from "../read.dynamo.command";
import { ReleaseToggleCommand } from "./release-toggle.command";
import { CreateEnv } from "src/inout/in/create_env";
import { FilterEnv } from "src/inout/in/filter_env";
import { Validator } from "src/util/validator";
import { UpdateEnv } from "src/inout/in/update_env";


export class EnvCommand extends AbstractDynamoCommand implements CreateDynamoCommand, ReadDynamoCommand {

  private createEnvData: CreateEnv;
  private filterEnvData: FilterEnv;
  private updateEnvData: UpdateEnv;
  toggleSortKey?: string;


  constructor(data: CreateEnv | FilterEnv | UpdateEnv) {
    super();
    this.createEnvData = data as CreateEnv;
    this.filterEnvData = data as FilterEnv;
    this.updateEnvData = data as UpdateEnv;
  }

  public validateForCreation() {
    if (this.createEnvData.type === SupportedEnvType.TOGGLE) {
      if (!!this.createEnvData.appliesTo)
        throw new UnprocessableEntityException('appliesTo should not be specified when the env is a toggle');
      if (!this.createEnvData.toggle)
        throw new UnprocessableEntityException('toggle parameter is required');
      if (this.createEnvData.value)
        throw new UnprocessableEntityException('Toggles should not have a top value');
      
      Validator.maxLength(this.createEnvData.entities, MAX_CREATED_ENTITY_PER_REQUEST);

    } else if (this.createEnvData.type === SupportedEnvType.BASIC) {
      if (!this.createEnvData.value)
        throw new UnprocessableEntityException('basic env should have a value');
      if (!this.createEnvData.appliesTo)
        throw new UnprocessableEntityException(`You need to specify the scope of this env with the appliesTo parameter (accepted values: ${Object.values(SupportedAppliesToForBasic)})`);
      if (!Object.values(SupportedAppliesToForBasic).includes(this.createEnvData.appliesTo as SupportedAppliesToForBasic))
        throw new UnprocessableEntityException('Unsupported appliesTo for basic env');
      
      Validator.notPresent(this.createEnvData, 'entities');
    } else {
      throw new UnprocessableEntityException(`Env should be of one of these types ${Object.values(SupportedEnvType)}`);
    }
  }

  buildCreateCommandInputs(): PutCommandInput[] {

    const metadataCommand = {
      TableName: TABLE_NAME,
      Item: {
        PK: `ENV#${this.createEnvData.name}`,
        SK: `ENV#${this.createEnvData.name}#${this.createEnvData.appliesTo || SupportedAppliesTo.GRANULAR}`,
        name: this.createEnvData.name,
        description: this.createEnvData.description,
        createdAtTimestamp: Utils.unixTimestampNow(),
        envType: this.createEnvData.type
      }
    }

    if (this.createEnvData.type === SupportedEnvType.TOGGLE) {
      this.commands.push(metadataCommand);
      const releaseToggleCommand = new ReleaseToggleCommand(this.createEnvData.toggle);
      this.toggleSortKey = releaseToggleCommand.sortKey;
      const toggleCommand = releaseToggleCommand.buildCreateCommandInputs({ envName: this.createEnvData.name })[0];
      this.commands.push(toggleCommand);
    } else {
      metadataCommand.Item['value'] = this.createEnvData.value;
      metadataCommand.Item['secret'] = this.createEnvData.secret;
      metadataCommand.Item['appliesTo'] = this.createEnvData.appliesTo;
      this.commands.push(metadataCommand);
    }
    return this.commands;
  }

  mapItemToChange(event: string) {
    const metadata = this.commands[0].Item;
    const toggle = this.commands[1]?.Item;
    const { ['PK']: PK, ['SK']: _y, ...cleanedMetadata } = metadata
    let changes = {...cleanedMetadata};
    if (toggle) {
      const { ['PK']: _a, ['SK']: _b, ...cleanedToggle } = toggle;
      changes = {...changes, ...cleanedToggle};
    }
    const item = {
      TableName: TABLE_NAME,
      Item: {
        event: event,
        PK: PK,
        SK: `HISTORY#${uuid()}#${metadata.appliesTo || SupportedAppliesTo.GRANULAR}`,
        changes: changes
      }
    }
    return item;
  }

  buildQueryCommandInputs(): QueryCommandInput[] {
    if (this.filterEnvData != null) {
      return this.buildCreateCommandInputsForOne();
    }
    return this.buildQueryCommandInputsForAll();
  }

  buildQueryCommandInputsForAll(): QueryCommandInput[] {
    var commands = [];
    Object.values(SupportedEnvType).forEach((envType) =>
      commands.push({
        TableName: TABLE_NAME,
        IndexName: GlobalSecondaryIndexes.ENV_TYPE_INDEX,
        KeyConditionExpression: "envType = :env_type",
        ExpressionAttributeValues: {
          ":env_type": envType
        }    
      })
    );
    Object.values(SupportedToggleType).forEach((toggleType) =>
      commands.push({
        TableName: TABLE_NAME,
        IndexName: GlobalSecondaryIndexes.TOGGLE_TYPE_INDEX,
        KeyConditionExpression: "toggleType = :toggleType",
        ExpressionAttributeValues: {
          ":toggleType": toggleType
        }
      })
    );
    return commands;
  }

  public validateForQueryOne() {
    if (this.filterEnvData.key == null)
      throw new PreconditionFailedException('key must be specified to get an env');
  }

  buildCreateCommandInputsForOne(): QueryCommandInput[] {
    const command = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": this.filterEnvData.key
      }
    };
    return [command];
  }


  public validateForUpdate() {
    Validator.require(this.updateEnvData.params, 'appliedTo');
  }

  buildUpdateCommandInputs(): UpdateCommandInput[] {
    let updateExpression='set';
    let ExpressionAttributeNames={};
    let ExpressionAttributeValues = {};
    for (const property in this.updateEnvData.params) {
      updateExpression += ` #${property} = :${property} ,`;
      ExpressionAttributeNames['#'+property] = property ;
      ExpressionAttributeValues[':'+property]=this.updateEnvData.params[property];
    }

    updateExpression = updateExpression.slice(0, -1);
    const params = {
      TableName: TABLE_NAME,
      Key: {
       PK: this.updateEnvData.key,
       SK: `${this.updateEnvData.key}#${this.updateEnvData.params["appliedTo"] || SupportedAppliesTo.GRANULAR}`
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues
    };

    return [params];
  }
  
}