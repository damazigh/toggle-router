import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateEnv } from './db/model/create_env';
import { GetEnv } from './db/model/get_env';
import { EnvService } from './env.service';


@Controller('env')
export class EnvController {

  constructor(private envService: EnvService) {}

  @Post()
  public async createEnv(@Body() body: CreateEnv) {
    const res = await this.envService.create(body);
    return res;
  }

  @Get()
  public async all(@Query('type') type: string) {
    const res = await this.envService.all(new GetEnv(type));
    return res;
  }
}
