import { Controller, Get, Param } from '@nestjs/common';
import { CommonService } from './common.service';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get(':name')
  public async getHistory(@Param('name') name: string) {
    return await this.historyService.getHistory(name);
  }
}
