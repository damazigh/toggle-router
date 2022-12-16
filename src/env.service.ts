import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateEnv } from './db/env_variable/create_env';

@Injectable()
export class EnvService {
  
  public async create(createEnv: CreateEnv) {
    if (createEnv.type === 'toggle') {
      if (!!createEnv.appliesTo)
        throw new UnprocessableEntityException('appliesTo should not be specified when the env is a toggle');
      if (!createEnv.toggle)
        throw new UnprocessableEntityException('toggle parameter is required');

      
    }
  }
}
