import { Injectable } from '@angular/core';
import { SoftresRaidSlug } from '../softres/softres-raid-slug';
import { RaidZoneAndSize } from './raid-zone-and-size.interface';

@Injectable({
  providedIn: 'root'
})
export class RaidService {
  constructor() {}

  public getZoneAndSize(softresSlug: SoftresRaidSlug): RaidZoneAndSize {
    switch (softresSlug) {
      case 'wotlknaxx10p2':
      case 'obsidiansanctum10p2':
      case 'wyrmrest10p2':
      case 'eyeofeternity10p2':
      case 'naxxdragons10p2':
        return { zoneId: 1015, size: 10 };
      case 'wotlknaxx25':
      case 'obsidiansanctum25':
      case 'wyrmrest25':
      case 'eyeofeternity25':
      case 'naxxdragons25':
        return { zoneId: 1015, size: 25 };
      case 'ulduar10':
        return { zoneId: 1017, size: 10 };
      case 'ulduar25':
        return { zoneId: 1017, size: 25 };
      default:
        return { zoneId: -1, size: 40 };
    }
  }
}
