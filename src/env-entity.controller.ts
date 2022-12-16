import { Body, Controller, Post } from '@nestjs/common';

@Controller('env-entity')
export class EnvEntityController {

  @Post()
  public async create(@Body() body) {
    
  }
}
