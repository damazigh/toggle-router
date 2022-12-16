import { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { UnprocessableEntityException } from "@nestjs/common";
import { CreateEnv } from "src/db/env_variable/create_env";
import { SupportedEnvType, TABLE_NAME } from "src/enum/constant";
import { Utils } from "src/util/utils";
import { uuid } from "uuidv4";
import { AbstractDynamoCommand } from "../abstract.command";
import { CreateDynamoCommand } from "../create.dynamo.command";
import { ReleaseToggleCommand } from "./release-toggle.command";

export class EnvCommand extends AbstractDynamoCommand implements CreateDynamoCommand {

  constructor(private data: CreateEnv) {
    super();
  }

  public validateForCreation() {
    if (this.data.type === SupportedEnvType.TOGGLE) {
      if (!!this.data.appliesTo)
        throw new UnprocessableEntityException('appliesTo should not be specified when the env is a toggle');
      if (!this.data.toggle)
        throw new UnprocessableEntityException('toggle parameter is required');
      if (!this.data.value && this.data.appliesTo !== 'granular')
        throw new UnprocessableEntityException('Value is required when toggle is not granular');
      if (this.data.value && this.data.appliesTo === 'granular')
        throw new UnprocessableEntityException('Granular toggle should not have a top value');
    } else if (this.data.type === SupportedEnvType.BASIC) {
      if (!this.data.value)
        throw new UnprocessableEntityException('basic env should have a value');
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
        description: this.data.description,
        createdAtTimestamp: Utils.unixTimestampNow()
      }
    }

    if (this.data.type === SupportedEnvType.TOGGLE) {
      this.commands.push(metadataCommand);
      this.commands.push(new ReleaseToggleCommand(this.data.toggle).buildCreateCommandInputs({ envName: this.data.name }));
      
    } else {
      metadataCommand.Item['secret'] = this.data.secret;
      this.commands.push(metadataCommand);
    }
    return this.commands;
  }

  mapItemToChange() {
    const metadata = this.commands[0].Item;
    const toggle = this.commands[1]?.Item;
    const { ['PK']: _x, ['SK']: _y, ...cleanedMetadata } = metadata
    let changes = {...cleanedMetadata};
    if (toggle) {
      const { ['PK']: _a, ['SK']: _b, ...cleanedToggle } = toggle;
      changes = {...changes, ...cleanedToggle};
    }
    const item = {
      TableName: TABLE_NAME,
      Item: {
        PK: `ENV#${metadata.name}`,
        SK: `History#${uuid()}`,
        changes: [
          changes
        ]
      }
    }
  }
}