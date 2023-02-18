import { IGetCharacterZoneRankingsRequest } from './get-character-zone-rankings-request.interface';

export interface IGetMultipleCharacterZoneRankingsRequest {
  characters: IGetCharacterZoneRankingsRequest[];
}
