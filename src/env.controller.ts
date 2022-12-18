import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEnv } from './inout/in/create_env';
import { EnvService } from './env.service';
import { FilterEnv } from './inout/in/filter_env';
import { SupportedAppliesTo } from './enum/constant';


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

  @Get(':appliesTo/:name')
  public async getRegionEnv(@Param('name') name: string, @Param('appliesTo') appliesTo: SupportedAppliesTo) {
    return await this.envService.getEnvV2(name, appliesTo)
  }

  @Get(':key/history')
  public async envHistory(@Param() filterEnv: FilterEnv) {
    const res = await this.envService.getEnvHistory(filterEnv);
    return res;
  }

}
