import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "src/enum/constant";
import { Historisant } from "./historisant";
import client from '../client';

export abstract class AbstractDynamoCommand implements Historisant {
  
  protected commands: any [] = [];
  
  public mapItemToChange(): any {
    return null;
  }

  async historizeCreate(item: any) {
    if (item) {
      const cmd = {
        TableName: TABLE_NAME,
        Item: {
          ...item,
          event: 'CREATE'
        }
      }
      await client.send(new PutCommand(cmd));
    }
  }

  async create(commands: PutCommandInput[], historize = false) {
    commands.forEach(async command => {
      let putCommand = new PutCommand(command);
      await client.send(putCommand);
    });

    this.historizeCreate(this.mapItemToChange());
  }

  async historizeUpdate(oldItem: any, newItem: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
