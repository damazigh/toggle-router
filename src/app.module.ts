import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';
import { MetadataController } from './metadata.controller';
import { EnvEntityController } from './env-entity.controller';
import { EnvEntityService } from './env-entity.service';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [],
  controllers: [EnvController, MetadataController, EnvEntityController, HistoryController],
  providers: [AppService, EnvService, EnvEntityService, HistoryService],
})
export class AppModule {}
