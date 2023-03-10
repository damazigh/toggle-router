import { Controller, Get } from '@nestjs/common';
import { SupportedEntities, SupportedAppliesToForBasic } from './enum/constant';

@Controller('metadata')
export class MetadataController {
  @Get()
  public all() {
    return [
      {
        name: 'Region',
        type: 'BASIC',
        options: Object.keys(SupportedAppliesToForBasic).map((v) => ({
          name: SupportedAppliesToForBasic[v],
          key: v,
        })),
      },
      {
        name: 'Granular',
        type: 'TOGGLE',
        options: Object.keys(SupportedEntities).map((v) => ({
          name: SupportedEntities[v],
          key: v,
        })),
      },
    ];
  }
}
