import { PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "src/enum/constant";
import { Historisant } from "./historisant";
import client from '../client';

export abstract class AbstractDynamoCommand implements Historisant {
  
  protected commands: any [] = [];
  
  public mapItemToChange(event: string): any {
    return null;
  }

  async historize(item: any) {
    if (item) {
      return client.send(new PutCommand(item));
    }
  }

  async create(commands: PutCommandInput[], historize = false) {
    commands.forEach(async command => {
      let putCommand = new PutCommand(command);
      await client.send(putCommand)
    });

    if (historize) {
      await this.historize(this.mapItemToChange('CREATE'));
    }
  }

  async read(commands: QueryCommandInput[]) {
    var items = [];
    for await (const command of commands) {
      let queryCommand = new QueryCommand(command);
      let res = await client.send(queryCommand);
      items.push(res.Items);
    }
    return items;
  }

}
