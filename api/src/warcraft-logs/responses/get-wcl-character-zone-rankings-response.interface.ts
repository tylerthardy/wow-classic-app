import { Character, ZoneRankings } from '../common';

export interface IGetWclCharacterZoneRankingsResponse extends Character {
  zoneRankings: ZoneRankings;
  size: number;
}
