import { PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { PreconditionFailedException, UnprocessableEntityException } from "@nestjs/common";
import { SupportedAppliesTo, SupportedAppliesToForBasic, SupportedEnvType, TABLE_NAME, ENV_TYPE, ENV_TYPE_INDEX } from "src/enum/constant";
import { Utils } from "src/util/utils";
import { uuid } from "uuidv4";
import { AbstractDynamoCommand } from "../abstract.command";
import { CreateDynamoCommand } from "../create.dynamo.command";
import { ReleaseToggleCommand } from "./release-toggle.command";
import { ReadDynamoCommand } from "../read.dynamo.command";
import { CreateEnv } from "src/db/model/create_env";
import { GetEnv } from "src/db/model/get_env";


export class EnvCommand extends AbstractDynamoCommand implements CreateDynamoCommand, ReadDynamoCommand {
  private createEnvData: CreateEnv
  private getEnvData: GetEnv

  constructor(private data: CreateEnv | GetEnv) {
    super();
    this.createEnvData = data as CreateEnv
    this.getEnvData = data as GetEnv
  }

  public validateForCreation() {
    if (this.createEnvData.type === SupportedEnvType.TOGGLE) {
      if (!!this.createEnvData.appliesTo)
        throw new UnprocessableEntityException('appliesTo should not be specified when the env is a toggle');
      if (!this.createEnvData.toggle)
        throw new UnprocessableEntityException('toggle parameter is required');
<<<<<<< HEAD
      if (this.data.value)
        throw new UnprocessableEntityException('Toggles should not have a top value');
    } else if (this.data.type === SupportedEnvType.BASIC) {
      if (!this.data.value)
=======
      if (!this.createEnvData.value && this.createEnvData.appliesTo !== SupportedAppliesTo.GRANULAR)
        throw new UnprocessableEntityException('Value is required when toggle is not granular');
      if (this.createEnvData.value && this.createEnvData.appliesTo === SupportedAppliesTo.GRANULAR)
        throw new UnprocessableEntityException('Granular toggle should not have a top value');
      if (!Object.values(SupportedAppliesTo).includes(this.createEnvData.toggle?.appliesTo as SupportedAppliesTo))
        throw new UnprocessableEntityException(`Unsupported appliesTo value: '${this.createEnvData.toggle.appliesTo}' - supported values: ${Object.values(SupportedAppliesTo)}`);  
    } else if (this.createEnvData.type === SupportedEnvType.BASIC) {
      if (!this.createEnvData.value)
>>>>>>> 02811bdae27f52274c868b13e4031ff4bc5500e6
        throw new UnprocessableEntityException('basic env should have a value');
      if (!this.createEnvData.appliesTo)
        throw new UnprocessableEntityException(`You need to specify the scope of this env with the applieTo parameter (accepted values: ${Object.values(SupportedAppliesToForBasic)})`); 
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
<<<<<<< HEAD
        PK: `ENV#${this.data.name}`,
        SK: `ENV#${this.data.name}`,
        description: this.data.description,
        createdAtTimestamp: Utils.unixTimestampNow(),
        type: this.data.type
=======
        PK: `ENV#${this.createEnvData.name}`,
        SK: `ENV#${this.createEnvData.name}`,
        description: this.createEnvData.description,
        createdAtTimestamp: Utils.unixTimestampNow()
>>>>>>> 02811bdae27f52274c868b13e4031ff4bc5500e6
      }
    }

    if (this.createEnvData.type === SupportedEnvType.TOGGLE) {
      this.commands.push(metadataCommand);
      const toggleCommand = new ReleaseToggleCommand(this.createEnvData.toggle).buildCreateCommandInputs({ envName: this.createEnvData.name })[0]; 
      this.commands.push(toggleCommand);
    } else {
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

  public validateForRead() {
    if (this.getEnvData.type !== SupportedEnvType.TOGGLE && this.getEnvData.type !== SupportedEnvType.BASIC) {
        throw new PreconditionFailedException('unsupported type provided');
    }
  }

  buildReadCommandInput(): QueryCommandInput {
    const readCommand = {
      TableName: TABLE_NAME,
      IndexName: ENV_TYPE_INDEX,
      KeyConditionExpression: `${ENV_TYPE} = :env_type`,
      ExpressionAttributeValues: {
        ":env_type": this.getEnvData.type
      }
    }
    return readCommand;
  }
  
}