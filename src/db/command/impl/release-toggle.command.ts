import { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { ReleaseToggle } from "src/db/model/toggle/release_toggle";
import { SupportedAppliesTo, TABLE_NAME } from "src/enum/constant";
import { uuid } from "uuidv4";
import { AbstractDynamoCommand } from "../abstract.command";
import { CreateDynamoCommand } from "../create.dynamo.command";

export class ReleaseToggleCommand extends AbstractDynamoCommand implements CreateDynamoCommand {
  
  constructor(private toggle: ReleaseToggle) {
    super();
  }

  buildCreateCommandInputs(opts: { envName: string }): PutCommandInput | PutCommandInput[] {
    const cmd = {
      TableName: TABLE_NAME,
      Item: {
        PK: `ENV#${opts.envName}`,
        SK: `TOGGLE#${uuid()}`,
        toggleType: this.toggle.toggleType,
        appliesTo: SupportedAppliesTo.GRANULAR
      }
    };
    this.commands.push(cmd);
    return this.commands;
  }
}