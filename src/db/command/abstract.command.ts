import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "src/enum/constant";
import { Historisant } from "./historisant";
import client from '../client';

export class AbstractDynamoCommand implements Historisant {
  
  async historizeCreate(item: any) {
    const cmd = {
      TableName: TABLE_NAME,
      Item: {
        ...item,
        event: 'CREATE'
      }
    }
    await client.send(new PutCommand(cmd));
  }

  async create(commands: PutCommandInput[], historize = false) {
    commands.forEach(async command => {
      let putCommand = new PutCommand(command);
      await client.send(putCommand);
      if (historize) {
        this.historizeCreate(command.Item);
      }
    });

  }

  async historizeUpdate(oldItem: any, newItem: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}