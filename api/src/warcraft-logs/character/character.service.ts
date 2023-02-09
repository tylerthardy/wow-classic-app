import { ApolloClient, ApolloQueryResult, gql, TypedDocumentNode } from '@apollo/client/core';
import { Injectable } from '@nestjs/common';
import { CharacterData } from '../common';
import { GetCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsResponse } from './responses';

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
    queries: GetCharacterZoneRankingsRequest[]
  ): Promise<GetCharacterZoneRankingsResponse[]> {
    return Promise.all(queries.map((query) => this.getCharacterZoneRankings(query)));
  }
}
