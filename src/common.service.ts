import { GetCommand, GetCommandInput, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import client from './db/client';
import { TABLE_NAME } from './enum/constant';

@Injectable()
export class CommonService {
  public async searchByPk(pk: string) {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": pk
      }
    };
    return this.search(params)
  }

  public async searchByPKAndSkBeginWith(pk: string, startsWith: string) {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK and begins_with(#SK, :startsWith)",
      ExpressionAttributeValues: {
        ":PK": pk,
       ":startsWith": startsWith
      },
      ExpressionAttributeNames: {
        '#SK': 'SK'
      }
    };
    return this.search(params)
  }

  private async search(params) {
    return client.send(new QueryCommand(params));
  }

}
