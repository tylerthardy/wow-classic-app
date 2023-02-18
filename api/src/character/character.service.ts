import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'common-errors';
import { GetWclCharacterZoneRankingsResponse } from '../warcraft-logs/models/get-wcl-character-zone-rankings-response.interface';
import { WarcraftLogsService } from '../warcraft-logs/warcraft-logs.service';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsResponse } from './responses/get-character-zone-rankings-response';
import { GetMultipleCharacterZoneRankingsResponse } from './responses/get-multiple-character-zone-rankings-response';
import { GetMultipleCharacterZoneRankingsResponseItem } from './responses/get-multiple-character-zone-rankings-response-item';

@Injectable()
export class CharacterService {
  constructor(private warcraftLogsService: WarcraftLogsService) {}

  public async getCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<GetCharacterZoneRankingsResponse> {
    const wclRankings = await this.getWclCharacterZoneRankings(request);
    if (!wclRankings || !wclRankings.name) {
      throw new NotFoundError('character not found');
    }
    return new GetCharacterZoneRankingsResponse(wclRankings);
  }

  public async getMultipleCharactersZoneRankings(
    request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<GetMultipleCharacterZoneRankingsResponse> {
    type fuckery = {
      query: any;
      rankingData: any;
    };

    // FIXME: Hacky
    const mapForInput: fuckery[] = await Promise.all(
      request.characters.map(async (query) => {
        const rankingData = await this.getWclCharacterZoneRankings(query);
        return {
          query: query,
          rankingData: rankingData
        };
      })
    );

    const characters: GetMultipleCharacterZoneRankingsResponseItem[] = mapForInput.map(
      (queryAndData) => new GetMultipleCharacterZoneRankingsResponseItem(queryAndData.query, queryAndData.rankingData)
    );

    return new GetMultipleCharacterZoneRankingsResponse(characters);
  }

  private async getWclCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<GetWclCharacterZoneRankingsResponse> {
    return await this.warcraftLogsService.getWclCharacterZoneRankings(request);
  }
}
