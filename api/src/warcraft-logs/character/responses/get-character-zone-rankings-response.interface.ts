import { Character, ZoneRankings } from '../../common';

export interface GetCharacterZoneRankingsResponse extends Character {
  zoneRankings: ZoneRankings;
}
