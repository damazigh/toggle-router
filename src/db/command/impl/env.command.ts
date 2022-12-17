import { GetCommandInput, PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { PreconditionFailedException, UnprocessableEntityException } from "@nestjs/common";
import { SupportedAppliesToForBasic, SupportedEnvType, TABLE_NAME, ENV_TYPE_INDEX } from "src/enum/constant";
import { Utils } from "src/util/utils";
import { uuid } from "uuidv4";
import { AbstractDynamoCommand } from "../abstract.command";
import { CreateDynamoCommand } from "../create.dynamo.command";
import { ReadDynamoCommand } from "../read.dynamo.command";
import { ReleaseToggleCommand } from "./release-toggle.command";
import { CreateEnv } from "src/inout/in/create_env";
import { GetEnv } from "src/inout/in/get_env";


export class EnvCommand extends AbstractDynamoCommand implements CreateDynamoCommand, ReadDynamoCommand {

  private createEnvData: CreateEnv;
  private getEnvData: GetEnv;


  constructor(data: CreateEnv | GetEnv) {
    super();
    this.createEnvData = data as CreateEnv;
    this.getEnvData = data as GetEnv;
  }

  public validateForCreation() {
    if (this.createEnvData.type === SupportedEnvType.TOGGLE) {
      if (!!this.createEnvData.appliesTo)
        throw new UnprocessableEntityException('appliesTo should not be specified when the env is a toggle');
      if (!this.createEnvData.toggle)
        throw new UnprocessableEntityException('toggle parameter is required');
      if (this.createEnvData.value)
        throw new UnprocessableEntityException('Toggles should not have a top value');
    } else if (this.createEnvData.type === SupportedEnvType.BASIC) {
      if (!this.createEnvData.value)
        throw new UnprocessableEntityException('basic env should have a value');
      if (!this.createEnvData.appliesTo)
        throw new UnprocessableEntityException(`You need to specify the scope of this env with the appliesTo parameter (accepted values: ${Object.values(SupportedAppliesToForBasic)})`);
      if (!Object.values(SupportedAppliesToForBasic).includes(this.createEnvData.appliesTo as SupportedAppliesToForBasic))
        throw new UnprocessableEntityException('Unsupported appliesTo for basic env');
    } else {
      throw new UnprocessableEntityException(`Env should be of one of these types ${Object.values(SupportedEnvType)}`);
    }
  }

  buildCreateCommandInputs(): PutCommandInput[] {

    const metadataCommand = {
      TableName: TABLE_NAME,
      Item: {
        PK: `ENV#${this.createEnvData.name}`,
        SK: `ENV#${this.createEnvData.name}`,
        name: this.createEnvData.name,
        description: this.createEnvData.description,
        createdAtTimestamp: Utils.unixTimestampNow(),
        envType: this.createEnvData.type
      }
    }

    if (this.createEnvData.type === SupportedEnvType.TOGGLE) {
      this.commands.push(metadataCommand);
      const toggleCommand = new ReleaseToggleCommand(this.createEnvData.toggle).buildCreateCommandInputs({ envName: this.createEnvData.name })[0];
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
        SK: `HISTORY#${uuid()}`,
        changes: [
          changes
        ]
      }
    }
    return item;
  }

  buildQueryCommandInputs(): QueryCommandInput[] {
    var commands = [];
    Object.values(SupportedEnvType).forEach((envType) =>
      commands.push({
        TableName: TABLE_NAME,
        IndexName: ENV_TYPE_INDEX,
        KeyConditionExpression: `envType = :env_type`,
        ExpressionAttributeValues: {
          ":env_type": envType
        }    
      })
    );
    return commands;
  }

  public validateForGet() {
    if (this.getEnvData.key == null)
      throw new PreconditionFailedException('key must be specified to get an env');
  }

  buildGetCommandInput(): GetCommandInput {
    const command = {
      TableName: TABLE_NAME,
      Key: {
        PK: this.getEnvData.key,
        SK: this.getEnvData.key,
      }
    };
    return command;
  }
  
}