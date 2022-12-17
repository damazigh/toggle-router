import { Module } from '@nestjs/common';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';
import { MetadataController } from './metadata.controller';
import { EnvEntityController } from './env-entity.controller';
import { EnvEntityService } from './env-entity.service';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { CommonService } from './common.service';

@Module({
  imports: [],
  controllers: [EnvController, MetadataController, EnvEntityController, HistoryController],
  providers: [EnvService, EnvEntityService, HistoryService, CommonService],
})
export class AppModule {}
