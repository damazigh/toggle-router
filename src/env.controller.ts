import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEnv } from './inout/in/create_env';
import { EnvService } from './env.service';
import { FilterEnv } from './inout/in/filter_env';


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

  @Get(':key')
  public async env(@Param() filterEnv: FilterEnv) {
    const res = await this.envService.getEnv(filterEnv);
    return res;
  }

  @Get(':key/history')
  public async envHistory(@Param() filterEnv: FilterEnv) {
    const res = await this.envService.getEnvHistory(filterEnv);
    return res;
  }

}
