import { BatchWriteCommand, BatchWriteCommandInput, PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
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

  async createBatch(command: BatchWriteCommandInput) {
    await client.send(new BatchWriteCommand(command));
  }

  async read(command: QueryCommandInput) {
    return await client.send(new QueryCommand(command));
  }

}
