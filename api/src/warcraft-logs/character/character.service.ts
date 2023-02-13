import { ApolloClient, ApolloQueryResult, gql, TypedDocumentNode } from '@apollo/client/core';
import { Injectable } from '@nestjs/common';
import { CharacterData } from '../common';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsResponse, IGetMultipleCharacterZoneRankingsResponseV2 } from './responses';
import { GetMultipleCharacterZoneRankingsResponseV2Item } from './responses/get-multiple-character-zone-rankings-response-v2-item';

@Injectable()
export class CharacterService {
  constructor(private apollo: ApolloClient<any>) {}
  public async getCharacterZoneRankings(
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

  public getMultipleCharactersZoneRankings(
    request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<GetCharacterZoneRankingsResponse[]> {
    return Promise.all(request.characters.map((query) => this.getCharacterZoneRankings(query)));
  }

  public async getMultipleCharactersZoneRankingsV2(
    request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<IGetMultipleCharacterZoneRankingsResponseV2> {
    type fuckery = {
      query: any;
      rankingData: any;
    };

    const mapForInput: fuckery[] = await Promise.all(
      request.characters.map(async (query) => {
        const rankingData = await this.getCharacterZoneRankings(query);
        return {
          query: query,
          rankingData: rankingData
        };
      })
    );

    const characters = mapForInput.map(
      (queryAndData) => new GetMultipleCharacterZoneRankingsResponseV2Item(queryAndData.query, queryAndData.rankingData)
    );

    return {
      characters: characters
    };
  }
}
