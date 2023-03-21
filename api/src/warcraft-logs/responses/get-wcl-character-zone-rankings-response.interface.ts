import { Character, ZoneRankings } from '../common';

export interface IGetWclCharacterZoneRankingsResponse extends Character {
  zoneRankings: ZoneRankings;
  // FIXME: This is a hack onto this to pass through
  size: number;
  // FIXME: This is a hack onto this to pass through
  lastUpdated: number;
}
