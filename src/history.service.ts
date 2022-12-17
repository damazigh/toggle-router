import { Get, Injectable } from '@nestjs/common';
import { CommonService } from './common.service';

@Injectable()
export class HistoryService {

  constructor(private commonService: CommonService) {}
  
  public async getHistory(name: string) {
    const res = await this.commonService.searchByPKAndSkBeginWith(`ENV#${name}`, 'HISTORY#');
    return res.Items;
  }
}
