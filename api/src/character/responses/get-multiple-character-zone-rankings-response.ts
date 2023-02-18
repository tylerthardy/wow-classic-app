import {
  IGetMultipleCharacterZoneRankingsResponse,
  IGetMultipleCharacterZoneRankingsResponseItem
} from '../../../../models/api';
import { GetMultipleCharacterZoneRankingsResponseItem } from './get-multiple-character-zone-rankings-response-item';

export class GetMultipleCharacterZoneRankingsResponse implements IGetMultipleCharacterZoneRankingsResponse {
  public characters: IGetMultipleCharacterZoneRankingsResponseItem[];

  constructor(characters: GetMultipleCharacterZoneRankingsResponseItem[]) {
    this.characters = characters;
  }
}
