import { Body, Controller, Post } from '@nestjs/common';
import { CreateEnvEntity } from './db/model/create-env-entity.model';
import { EnvEntityService } from './env-entity.service';

@Controller('env-entity')
export class EnvEntityController {
  constructor(private envEntityService: EnvEntityService) {}

  @Post()
  public async create(@Body() body: CreateEnvEntity[]) {
    return await this.envEntityService.create(body)
  }
}
