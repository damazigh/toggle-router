import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateEnv } from './inout/in/create_env';
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
  public async all() {
    const res = await this.envService.all();
    return res;
  }
}
