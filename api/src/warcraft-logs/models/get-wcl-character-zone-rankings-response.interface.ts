import { Character, ZoneRankings } from '../../../../models/warcraft-logs';

export interface GetWclCharacterZoneRankingsResponse extends Character {
  zoneRankings: ZoneRankings;
}
