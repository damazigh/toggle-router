import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { SupportedAppliesTo } from './enum/constant';
import { EnvEntityService } from './env-entity.service';
import { CreateEnvEntity } from './inout/in/create-env-entity.model';
import { GetEnvEntities } from './inout/in/get_env_entities';
import { NotificationService } from './notification.service';

@Controller('env-entity')
export class EnvEntityController {
  constructor(
    private envEntityService: EnvEntityService,
    private commonService: CommonService,
    private notificationService: NotificationService
    ) {}

  @Post()
  public async create(@Body() body: CreateEnvEntity[]) {
    const res = await this.envEntityService.create(body)
    await this.notificationService.create(this.notificationService.build('event', 'INVALIDATE_CACHE'));
    return res;
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

  @Get(':name/entities/:entityId')
  public async entityByIdTypeAndName(@Param('entityId') entityId: string, @Param('name') name, @Query('type') type: string) {
    return await this.envEntityService.getOne(entityId, type, name);
  }

}
