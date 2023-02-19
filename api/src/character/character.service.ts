import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'common-errors';
import { GetWclCharacterZoneRankingsResponse } from '../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { WarcraftLogsService } from '../warcraft-logs/warcraft-logs.service';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsV2Response } from './responses/get-character-zone-rankings-response-v2';
import { GetMultipleCharacterZoneRankingsResponseItem } from './responses/get-multiple-character-zone-rankings-response-item';

@Injectable()
export class CharacterService {
  constructor(private warcraftLogsService: WarcraftLogsService) {}

  public async getCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<GetCharacterZoneRankingsV2Response> {
    const wclRankings = await this.getWclCharacterZoneRankings(request);
    if (!wclRankings || !wclRankings.name) {
      throw new NotFoundError('character not found');
    }
    return new GetCharacterZoneRankingsV2Response(wclRankings);
  }

  public async getMultipleCharactersZoneRankings(
    request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<GetMultipleCharacterZoneRankingsResponseItem[]> {
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

    const characters = mapForInput.map(
      (queryAndData) => new GetMultipleCharacterZoneRankingsResponseItem(queryAndData.query, queryAndData.rankingData)
    );

    return characters;
  }

  private async getWclCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<GetWclCharacterZoneRankingsResponse> {
    return await this.warcraftLogsService.getWclCharacterZoneRankings(request);
  }
}
