import { Injectable, Logger } from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { IGetCharacterZoneRankingsResponse, IGetMultipleCharacterZoneRankingsResponse } from 'classic-companion-core';
import { NotFoundError } from 'common-errors';
import { PlayerTableService } from '../common/player-table/player-table.service';
import { IGetWclCharacterZoneRankingsResponse } from '../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { WarcraftLogsService } from '../warcraft-logs/warcraft-logs.service';
import {
  GetCharacterZoneRankingsRequest,
  GetMultipleCharacterZoneRankingsRequest,
  IGetCharacterZoneRankingsRequest
} from './requests';
import { GetCharacterZoneRankingsResponse } from './responses/get-character-zone-rankings-response';
import { GetMultipleCharacterZoneRankingsResponseItem } from './responses/get-multiple-character-zone-rankings-response-item';

@Injectable()
export class CharacterService {
  private bypassCache: boolean = true;

  constructor(private warcraftLogsService: WarcraftLogsService, private playerTableService: PlayerTableService) {}

  public async getCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<IGetCharacterZoneRankingsResponse> {
    const wclRankings: IGetWclCharacterZoneRankingsResponse = await this.getWclCharacterZoneRankings(request);
    if (!wclRankings || !wclRankings.name) {
      throw new NotFoundError('character not found');
    }
    return new GetCharacterZoneRankingsResponse(wclRankings);
  }

  public async getMultipleCharactersZoneRankings(
    request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<IGetMultipleCharacterZoneRankingsResponse> {
    const responseCharacters: GetMultipleCharacterZoneRankingsResponseItem[] = [];
    const characterRequests: Promise<IGetWclCharacterZoneRankingsResponse>[] = [];

    for (const [i, character] of request.characters.entries()) {
      const validationErrors = await this.getCharacterValidationErrors(character);
      if (validationErrors.length > 0) {
        const errors = validationErrors.map((error) => error.constraints);
        const responseItem = new GetMultipleCharacterZoneRankingsResponseItem(character, undefined, errors);
        responseCharacters[i] = responseItem;
      } else {
        try {
          const characterRequest: Promise<IGetWclCharacterZoneRankingsResponse> =
            this.getWclCharacterZoneRankingsWithCache(character);
          characterRequests[i] = characterRequest;
        } catch (err) {
          const errors = [err];
          const responseItem = new GetMultipleCharacterZoneRankingsResponseItem(character, undefined, errors);
          responseCharacters[i] = responseItem;
        }
      }
    }

    const zoneRankingResults: PromiseSettledResult<IGetWclCharacterZoneRankingsResponse>[] = await Promise.allSettled(
      characterRequests
    );
    for (const [i, wclResult] of zoneRankingResults.entries()) {
      if (wclResult.status === 'fulfilled' && !wclResult.value) {
        // If there's no result value, it was an empty request
        continue;
      }
      const characterRequest = request.characters[i];
      const responseItem: GetMultipleCharacterZoneRankingsResponseItem =
        wclResult.status === 'fulfilled'
          ? new GetMultipleCharacterZoneRankingsResponseItem(characterRequest, wclResult.value, [])
          : new GetMultipleCharacterZoneRankingsResponseItem(characterRequest, undefined, [wclResult.reason]);
      responseCharacters[i] = responseItem;
    }

    return {
      characters: responseCharacters
    };
  }

  private async getCharacterValidationErrors(character: IGetCharacterZoneRankingsRequest): Promise<ValidationError[]> {
    const request = new GetCharacterZoneRankingsRequest();
    request.characterName = character.characterName;
    request.metric = character.metric;
    request.classSlug = character.classSlug;
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
