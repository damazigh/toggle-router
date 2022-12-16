import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEnv } from './db/model/create_env';
import client from './db/client';
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
  public greet() {
    return 'Hello world!'
  }
}
