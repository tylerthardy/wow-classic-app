import { Injectable, Logger } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { NotFoundError } from 'common-errors';
import { PlayerTableService } from '../common/player-table/player-table.service';
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
  private bypassCache: boolean = false;

  constructor(private warcraftLogsService: WarcraftLogsService, private playerTableService: PlayerTableService) {}

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
    const responseCharacters: GetMultipleCharacterZoneRankingsResponseItem[] = [];
    const characterRequests: Promise<IGetWclCharacterZoneRankingsResponse>[] = [];

    for (const character of request.characters) {
      const validationErrors = await this.getCharacterValidationErrors(character);
      if (validationErrors.length > 0) {
        const errors = validationErrors.map((error) => error.constraints);
        const responseItem = new GetMultipleCharacterZoneRankingsResponseItem(character, undefined, errors);
        responseCharacters.push(responseItem);
        continue;
      }

      try {
        const characterRequest: Promise<IGetWclCharacterZoneRankingsResponse> =
          this.getWclCharacterZoneRankingsWithCache(character);
        characterRequests.push(characterRequest);
      } catch (err) {
        const errors = [err];
        const responseItem = new GetMultipleCharacterZoneRankingsResponseItem(character, undefined, errors);
        responseCharacters.push(responseItem);
      }
    }

    const zoneRankingResults: PromiseSettledResult<IGetWclCharacterZoneRankingsResponse>[] = await Promise.allSettled(
      characterRequests
    );
    for (const [i, wclResult] of zoneRankingResults.entries()) {
      const characterRequest = request.characters[i];
      const responseItem: GetMultipleCharacterZoneRankingsResponseItem =
        wclResult.status === 'fulfilled'
          ? new GetMultipleCharacterZoneRankingsResponseItem(characterRequest, wclResult.value, [])
          : new GetMultipleCharacterZoneRankingsResponseItem(characterRequest, undefined, [wclResult.reason]);
      responseCharacters.push(responseItem);
    }

    return {
      characters: responseCharacters
    };
  }

  private async getCharacterValidationErrors(character: IGetCharacterZoneRankingsRequest): Promise<ValidationError[]> {
    const request = new GetCharacterZoneRankingsRequest();
    request.characterName = character.characterName;
    request.metric = character.metric;
    request.classFileName = character.classFileName;
    request.serverRegion = character.serverRegion;
    request.serverSlug = character.serverSlug;
    request.size = character.size;
    request.zoneId = character.zoneId;
    const validationErrors = await validate(request);
    return validationErrors;
  }

  private async getWclCharacterZoneRankingsWithCache(
    request: GetCharacterZoneRankingsRequest
  ): Promise<IGetWclCharacterZoneRankingsResponse> {
    if (!this.bypassCache) {
      const cacheLookupResponse: IGetWclCharacterZoneRankingsResponse | undefined =
        await this.getCachedCharacterZoneRankings(request);
      if (cacheLookupResponse) {
        Logger.log('found cached response for ' + request.characterName);
        return cacheLookupResponse;
      }
    }
    const wclRequest: Promise<IGetWclCharacterZoneRankingsResponse> = this.getWclCharacterZoneRankings(request);
    return wclRequest;
  }

  private async getWclCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<IGetWclCharacterZoneRankingsResponse> {
    const characterRankings = await this.warcraftLogsService.getWclCharacterZoneRankings(request);

    const lastUpdated = Date.now().valueOf();
    characterRankings.lastUpdated = lastUpdated;
    await this.playerTableService
      .storeWclCharacterZoneRankings(
        request.serverRegion,
        request.serverSlug,
        request.characterName,
        request.zoneId,
        request.size,
        lastUpdated,
        characterRankings
      )
      .then((response) => {
        Logger.log(response);
      });
    return characterRankings;
  }

  private async getCachedCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<IGetWclCharacterZoneRankingsResponse | undefined> {
    try {
      const cachedRankings: IGetWclCharacterZoneRankingsResponse =
        await this.playerTableService.getCachedCharacterZoneRankings(
          request.serverRegion,
          request.serverSlug,
          request.characterName,
          request.zoneId,
          request.size
        );
      return cachedRankings;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return undefined;
      }
      throw error;
    }
  }
}
