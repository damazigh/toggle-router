import { Body, Controller, Post } from '@nestjs/common';
import { EnvEntityService } from './env-entity.service';
import { CreateEnvEntity } from './inout/in/create-env-entity.model';

@Controller('env-entity')
export class EnvEntityController {
  constructor(private envEntityService: EnvEntityService) {}

  @Post()
  public async create(@Body() body: CreateEnvEntity[]) {
    return await this.envEntityService.create(body)
  }
}
