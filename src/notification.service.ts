import { Injectable } from '@nestjs/common';
import { CreateNotification } from './db/model/create_notification';
import { SNSClient, PublishCommand, PublishCommandInput, ListTopicsCommand } from "@aws-sdk/client-sns";

@Injectable()
export class NotificationService {
  
  public async create(createNotification: CreateNotification): Promise<any> {
    const client = new SNSClient({
      region: "us-east-1",
      endpoint: "http://localstack:4566",
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test'
      }
    });

    const input = {
      Message: JSON.stringify({
        key: createNotification.key,
        value: createNotification.value
      }),
      TopicArn: 'arn:aws:sns:us-east-1:000000000000:toggle-cache-topic'
    };
    const command = new PublishCommand(input);
    // const command = new ListTopicsCommand({NextToken: null});
    return await client.send(command);
  }

  public build(key, value) {
    const n = new CreateNotification();
    n.key = key;
    n.value = value;
    return n;
  }
}
