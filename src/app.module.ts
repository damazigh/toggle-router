import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';
import { MetadataController } from './metadata.controller';

@Module({
  imports: [],
  controllers: [EnvController, MetadataController],
  providers: [AppService, EnvService],
})
export class AppModule {}
