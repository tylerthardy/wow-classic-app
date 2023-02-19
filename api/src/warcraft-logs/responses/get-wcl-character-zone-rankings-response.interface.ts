import { Character, ZoneRankings } from '../common';

export interface GetWclCharacterZoneRankingsResponse extends Character {
  zoneRankings: ZoneRankings;
}
