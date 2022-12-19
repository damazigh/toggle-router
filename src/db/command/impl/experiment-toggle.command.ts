import { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { ExperimentToggle } from "src/db/model/toggle/experiment_toggle";
import { TABLE_NAME } from "src/enum/constant";
import { uuid } from "uuidv4";
import { AbstractDynamoCommand } from "../abstract.command";
import { CreateDynamoCommand } from "../create.dynamo.command";

export class ExperimentToggleCommand extends AbstractDynamoCommand implements CreateDynamoCommand {
  sortKey: string;

  constructor(private toggle: ExperimentToggle) {
    super();
    this.sortKey = `TOGGLE#${uuid()}#${toggle.appliesTo}`;
  }


  buildCreateCommandInputs(opts?: any): PutCommandInput | PutCommandInput[] {
    const cmd = {
      TableName: TABLE_NAME,
      Item: {
        PK: `ENV#${opts.envName}`,
        SK: this.sortKey,
        toggleType: this.toggle.toggleType,
        appliesTo: this.toggle.appliesTo,
        name: opts.envName,
        data : this.toggle.data
      }
    };
    this.commands.push(cmd);
    return this.commands;
  }
}
