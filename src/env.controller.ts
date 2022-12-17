import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEnv } from './inout/in/create_env';
import { EnvService } from './env.service';
import { GetEnv } from './inout/in/get_env';


@Controller('env')
export class EnvController {

  constructor(private envService: EnvService) {}

  @Post()
  public async createEnv(@Body() body: CreateEnv) {
    const res = await this.envService.create(body);
    return res;
  }

  @Get()
  public all() {
    const res = this.envService.all();
    return res;
  }


  @Get(':key')
  public async env(@Param() getEnv: GetEnv) {
    const res = await this.envService.getEnv(getEnv);
    return res;
  }

}
