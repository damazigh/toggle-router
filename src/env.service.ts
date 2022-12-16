import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateEnv } from './db/env_variable/create_env';
import { SupportedEnvType } from './enum/constant';

@Injectable()
export class EnvService {
  
  public async create(createEnv: CreateEnv) {
    this.validateForCreation(createEnv);
    
  }


  private validateForCreation(createEnv: CreateEnv) {
    if (createEnv.type === SupportedEnvType.TOGGLE) {
      if (!!createEnv.appliesTo)
        throw new UnprocessableEntityException('appliesTo should not be specified when the env is a toggle');
      if (!createEnv.toggle)
        throw new UnprocessableEntityException('toggle parameter is required');
      if (!createEnv.value && createEnv.appliesTo !== 'granular')
        throw new UnprocessableEntityException('Value is required when toggle is not granular');
      if (createEnv.value && createEnv.appliesTo === 'granular')
        throw new UnprocessableEntityException('Granular toggle should not have a top value');
    } else if (createEnv.type === SupportedEnvType.TOGGLE) {
      if (!createEnv.value)
        throw new UnprocessableEntityException('basic env should have a value');
    } else {
      throw new UnprocessableEntityException(`Env should be of one of these types ${Object.values(SupportedEnvType)}`);
    }
  }
}
