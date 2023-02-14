import { ApolloClient, ApolloQueryResult, gql, TypedDocumentNode } from '@apollo/client/core';
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'common-errors';
import { CharacterData } from '../common';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsResponse } from './responses';
import { GetCharacterZoneRankingsV2Response } from './responses/get-character-zone-rankings-response-v2';
import { GetMultipleCharacterZoneRankingsResponseItem } from './responses/get-multiple-character-zone-rankings-response-item';

@Injectable()
export class CharacterService {
  constructor(private apollo: ApolloClient<any>) {}

  public async getCharacterZoneRankings(
    request: GetCharacterZoneRankingsRequest
  ): Promise<GetCharacterZoneRankingsResponse> {
    return this.getWclCharacterZoneRankings(request);
  }

  public async getCharacterZoneRankingsV2(
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
  ): Promise<GetCharacterZoneRankingsResponse> {
    const GET_CHARACTER_ZONE_RANKINGS: TypedDocumentNode<CharacterData, unknown> = gql`
          query {
            characterData {
              character(
                name: "${request.characterName}"
                serverSlug: "${request.serverSlug}"
                serverRegion: "${request.serverRegion}"
              ) {
                id
                name
                classID
                canonicalID
                server {
                  slug
                }
                zoneRankings(zoneID: ${request.zoneId}, metric: ${request.metric}, size: ${request.size})
              }
            }
          }
        `;

    const result: ApolloQueryResult<CharacterData> = await this.apollo.query({
      query: GET_CHARACTER_ZONE_RANKINGS,
      fetchPolicy: 'network-only'
    });
    return result.data.characterData.character as GetCharacterZoneRankingsResponse;
  }
}
