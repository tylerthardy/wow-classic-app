import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { NotFoundError } from 'common-errors';
import { IGetWclCharacterZoneRankingsResponse } from '../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { WarcraftLogsService } from '../warcraft-logs/warcraft-logs.service';
import {
  GetCharacterZoneRankingsRequest,
  GetMultipleCharacterZoneRankingsRequest,
  IGetCharacterZoneRankingsRequest
} from './requests';
import { IGetMultipleCharacterZoneRankingsResponse } from './responses';
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

  private mapToCharacterRequest(character: IGetCharacterZoneRankingsRequest) {
    const request = new GetCharacterZoneRankingsRequest();
    request.characterName = character.characterName;
    request.metric = character.metric;
    request.serverRegion = character.serverRegion;
    request.serverSlug = character.serverSlug;
    request.size = character.size;
    request.zoneId = character.zoneId;
    return request;
  }

  public async getMultipleCharactersZoneRankings(
    request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<IGetMultipleCharacterZoneRankingsResponse> {
    const characters: GetMultipleCharacterZoneRankingsResponseItem[] = [];

    for (const character of request.characters) {
      let errors: any[] = [];
      const characterRequest = this.mapToCharacterRequest(character);
      const validationErrors = await validate(characterRequest);
      if (validationErrors.length > 0) {
        for (const validationError of validationErrors) {
          errors.push(validationError.constraints);
        }
      }

      let rankingData: IGetWclCharacterZoneRankingsResponse | undefined;
      try {
        rankingData = await this.getWclCharacterZoneRankings(characterRequest);
      } catch (err) {
        errors.push(err);
      }
      const responseItem = new GetMultipleCharacterZoneRankingsResponseItem(characterRequest, rankingData, errors);
      characters.push(responseItem);
    }

    return {
      characters: characters
    };
  }

  private async getWclCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<IGetWclCharacterZoneRankingsResponse> {
    return await this.warcraftLogsService.getWclCharacterZoneRankings(request);
  }
}
