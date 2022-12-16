import { Controller, Get } from '@nestjs/common';
import { SupportedToggleType, SupportedAppliesTo, SupportedEnvType } from './enum/constant';

@Controller('metadata')
export class MetadataController {

    @Get()
    public all() {
        return {
            "env_types": SupportedEnvType,
            "toggle_types": SupportedToggleType,
            "scopes": SupportedAppliesTo
        }
    }
}
