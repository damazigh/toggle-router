import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { EnvEntityService } from './env-entity.service';
import { CreateEnvEntity } from './inout/in/create-env-entity.model';
import { GetEnvEntities } from './inout/in/get_env_entities';

@Controller('env-entity')
export class EnvEntityController {
  constructor(
    private envEntityService: EnvEntityService,
    private commonService: CommonService
    ) {}

  @Post()
  public async create(@Body() body: CreateEnvEntity[]) {
    return await this.envEntityService.create(body)
  }

  @Get(':toggleKey')
  public async env(@Param() getEnvEntities: GetEnvEntities) {
    const res = await this.envEntityService.getEnvEntities(getEnvEntities);
    return res;
  }

  @Get('/entities/:entityId')
  public async toggleByEntity(@Param('entityId') entityId: string, @Query('type') type: string) {
    return (await this.commonService.searchByPk(`${type.toUpperCase()}#${entityId}`)).Items;
  }

}
