import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateEnv } from './inout/in/create_env';
import { EnvService } from './env.service';
import { FilterEnv } from './inout/in/filter_env';
import { SupportedAppliesTo } from './enum/constant';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { UpdateEnv } from './inout/in/update_env';


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

  @Put(':key')
  public async updateEnv(@Param() params: string, @Body() body: CreateEnv) {
    var updateEnv = new UpdateEnv();
    updateEnv.key = params["key"];
    updateEnv.params = body;

    const res = await this.envService.update(updateEnv);
    return res;
  }
}
