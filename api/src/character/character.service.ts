import { Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
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

  public async getMultipleCharactersZoneRankings(
    request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<IGetMultipleCharacterZoneRankingsResponse> {
    const resultCharacters: GetMultipleCharacterZoneRankingsResponseItem[] = [];

    const wclRequests: Promise<IGetWclCharacterZoneRankingsResponse>[] = [];

    for (const character of request.characters) {
      const validationErrors = await this.getCharacterValidationErrors(character);
      if (validationErrors.length > 0) {
        const errors = validationErrors.map((error) => error.constraints);
        const responseItem = new GetMultipleCharacterZoneRankingsResponseItem(character, undefined, errors);
        resultCharacters.push(responseItem);
        continue;
      }

      try {
        const wclRequest: Promise<IGetWclCharacterZoneRankingsResponse> = this.getWclCharacterZoneRankings(character);
        wclRequests.push(wclRequest);
      } catch (err) {
        const errors = [err];
        const responseItem = new GetMultipleCharacterZoneRankingsResponseItem(character, undefined, errors);
        resultCharacters.push(responseItem);
      }
    }

    const wclResults: PromiseSettledResult<IGetWclCharacterZoneRankingsResponse>[] = await Promise.allSettled(
      wclRequests
    );
    for (const [i, wclResult] of wclResults.entries()) {
      const characterRequest = request.characters[i];
      const responseItem: GetMultipleCharacterZoneRankingsResponseItem =
        wclResult.status === 'fulfilled'
          ? new GetMultipleCharacterZoneRankingsResponseItem(characterRequest, wclResult.value, [])
          : new GetMultipleCharacterZoneRankingsResponseItem(characterRequest, undefined, [wclResult.reason]);
      resultCharacters.push(responseItem);
    }

    return {
      characters: resultCharacters
    };
  }

  private async getCharacterValidationErrors(character: IGetCharacterZoneRankingsRequest): Promise<ValidationError[]> {
    const request = new GetCharacterZoneRankingsRequest();
    request.characterName = character.characterName;
    request.metric = character.metric;
    request.serverRegion = character.serverRegion;
    request.serverSlug = character.serverSlug;
    request.size = character.size;
    request.zoneId = character.zoneId;
    const validationErrors = await validate(request);
    return validationErrors;
  }

  private async getWclCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<IGetWclCharacterZoneRankingsResponse> {
    return await this.warcraftLogsService.getWclCharacterZoneRankings(request);
  }
}
