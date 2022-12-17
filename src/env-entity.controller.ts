import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EnvEntityService } from './env-entity.service';
import { CreateEnvEntity } from './inout/in/create-env-entity.model';
import { GetEnvEntities } from './inout/in/get_env_entities';

@Controller('env-entity')
export class EnvEntityController {
  constructor(private envEntityService: EnvEntityService) {}

  @Post()
  public async create(@Body() body: CreateEnvEntity[]) {
    return await this.envEntityService.create(body)
  }

  @Get(':toggleKey')
  public async env(@Param() getEnvEntities: GetEnvEntities) {
    const res = await this.envEntityService.getEnvEntities(getEnvEntities);
    return res;
  }

}
