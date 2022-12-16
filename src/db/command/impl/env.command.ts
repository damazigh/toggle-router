import { PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { UnprocessableEntityException } from "@nestjs/common";
import { SupportedAppliesToForBasic, SupportedEnvType, TABLE_NAME, ENV_TYPE_INDEX } from "src/enum/constant";
import { Utils } from "src/util/utils";
import { uuid } from "uuidv4";
import { AbstractDynamoCommand } from "../abstract.command";
import { CreateDynamoCommand } from "../create.dynamo.command";
import { ReadDynamoCommand } from "../read.dynamo.command";
import { ReleaseToggleCommand } from "./release-toggle.command";
import { CreateEnv } from "src/db/model/create_env";


export class EnvCommand extends AbstractDynamoCommand implements CreateDynamoCommand, ReadDynamoCommand {

  constructor(private data: CreateEnv) {
    super();
  }

  public validateForCreation() {
    if (this.data.type === SupportedEnvType.TOGGLE) {
      if (!!this.data.appliesTo)
        throw new UnprocessableEntityException('appliesTo should not be specified when the env is a toggle');
      if (!this.data.toggle)
        throw new UnprocessableEntityException('toggle parameter is required');
      if (this.data.value)
        throw new UnprocessableEntityException('Toggles should not have a top value');
    } else if (this.data.type === SupportedEnvType.BASIC) {
      if (!this.data.value)
        throw new UnprocessableEntityException('basic env should have a value');
      if (!this.data.appliesTo)
        throw new UnprocessableEntityException(`You need to specify the scope of this env with the appliesTo parameter (accepted values: ${Object.values(SupportedAppliesToForBasic)})`);
      if (!Object.values(SupportedAppliesToForBasic).includes(this.data.appliesTo as SupportedAppliesToForBasic))
        throw new UnprocessableEntityException('Unsupported appliesTo for basic env');
    } else {
      throw new UnprocessableEntityException(`Env should be of one of these types ${Object.values(SupportedEnvType)}`);
    }
  }

  buildCreateCommandInputs(): PutCommandInput[] {

    const metadataCommand = {
      TableName: TABLE_NAME,
      Item: {
        PK: `ENV#${this.data.name}`,
        SK: `ENV#${this.data.name}`,
        name: this.data.name,
        description: this.data.description,
        createdAtTimestamp: Utils.unixTimestampNow(),
        envType: this.data.type
      }
    }

    if (this.data.type === SupportedEnvType.TOGGLE) {
      this.commands.push(metadataCommand);
      const toggleCommand = new ReleaseToggleCommand(this.data.toggle).buildCreateCommandInputs({ envName: this.data.name })[0]; 
      this.commands.push(toggleCommand);
    } else {
      metadataCommand.Item['value'] = this.data.value;
      metadataCommand.Item['secret'] = this.data.secret;
      metadataCommand.Item['appliesTo'] = this.data.appliesTo;
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

  buildReadCommandInputs(): QueryCommandInput[] {
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
  
}