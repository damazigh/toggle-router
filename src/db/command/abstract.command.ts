import { BatchWriteCommand, BatchWriteCommandInput, GetCommand, GetCommandInput, PutCommand, PutCommandInput, QueryCommand, QueryCommandInput, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
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

  async update(commands: UpdateCommandInput[]) {
    commands.forEach(async command => {
      let updateCommand = new UpdateCommand(command);
      await client.send(updateCommand)
    });
  }

  async createBatch(command: BatchWriteCommandInput) {
    await client.send(new BatchWriteCommand(command));
  }

  async query(commands: QueryCommandInput[]) {
    var items = [];
    for await (const command of commands) {
      let queryCommand = new QueryCommand(command);
      let res = await client.send(queryCommand);
      items.push(res.Items);
    }
    return items;
  }

}
