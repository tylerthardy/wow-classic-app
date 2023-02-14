import { ApolloClient, ApolloQueryResult, gql, TypedDocumentNode } from '@apollo/client/core';
import { Injectable } from '@nestjs/common';
import { IGetCharacterZoneRankingsRequest } from '../character/requests';
import { CharacterData } from './common';
import { GetWclCharacterZoneRankingsResponse } from './service/get-wcl-character-zone-rankings-response.interface';

@Injectable()
export class WarcraftLogsService {
  constructor(private apollo: ApolloClient<any>) {}

  public async getWclCharacterZoneRankings(
    request: IGetCharacterZoneRankingsRequest
  ): Promise<GetWclCharacterZoneRankingsResponse> {
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
    return result.data.characterData.character as GetWclCharacterZoneRankingsResponse;
  }
}
