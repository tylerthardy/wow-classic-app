import { IGetCharacterZoneRankingsResponse } from './get-character-zone-rankings-response.interface';

export interface IGetCharacterZoneRankingsWithSpecResponse extends IGetCharacterZoneRankingsResponse {
  specName: string;
}
