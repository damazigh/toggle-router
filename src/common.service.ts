import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import client from './db/client';
import { TABLE_NAME } from './enum/constant';

@Injectable()
export class CommonService {
  public async findByPK(pk: string) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": pk
      }
    };
    return this.find(params)
  }

  public async findByPKAndSkBeginWith(pk: string, startsWith: string) {
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
    return this.find(params)
  }

  private async find(params) {
    return client.send(new QueryCommand(params));
  }

}
