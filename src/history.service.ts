import { Get, Injectable, Param, Query } from '@nestjs/common';
import { CommonService } from './common.service';

@Injectable()
export class HistoryService {

  constructor(private commonService: CommonService) {}
  
  public async getHistory(@Param('name') name: string) {
    const res = await this.commonService.findByPKAndSkBeginWith(`ENV#${name}`, 'HISTORY#');
    return res.Items;
  }
}
