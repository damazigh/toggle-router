import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';

@Module({
  imports: [],
  controllers: [EnvController],
  providers: [AppService, EnvService],
})
export class AppModule {}
