import { Injectable } from '@angular/core';
import { Raid, Raids } from 'classic-companion-core';
import { SoftresRaidSlug } from '../softres/softres-raid-slug';
import { RaidZoneAndSize } from './raid-zone-and-size.interface';

@Injectable({
  providedIn: 'root'
})
export class RaidService {
  constructor() {}

  // FIXME: Enum
  public getZoneAndSize(softresSlug: SoftresRaidSlug): RaidZoneAndSize {
    const raid: Raid | undefined = Raids.getBySoftresSlug(softresSlug);
    if (!raid) {
      return { zoneId: -1, size: 40 };
    }

    return {
      zoneId: raid.instance.zoneId,
      size: raid.size
    };
  }
}
