import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EnvController } from './env.controller';
import { NotificationService } from './notification.service';
import { EnvService } from './env.service';
import { MetadataController } from './metadata.controller';
import { EnvEntityController } from './env-entity.controller';
import { NotificationController } from './notification.controller';

@Module({
  imports: [],
  controllers: [EnvController, MetadataController, EnvEntityController, NotificationController],
  providers: [AppService, EnvService, NotificationService],
})
export class AppModule {}
