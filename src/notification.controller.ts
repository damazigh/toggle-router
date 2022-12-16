import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateNotification } from './db/model/create_notification'
import { EnvService } from './env.service';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

  constructor(private notificationService: NotificationService) {}

  @Post()
  public async createNotification(@Body() body: CreateNotification) {
    return await this.notificationService.create(body);
  }
}
