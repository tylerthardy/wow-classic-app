import { ApolloClient, ApolloQueryResult, gql, HttpLink, InMemoryCache, TypedDocumentNode } from '@apollo/client/core';
import { Injectable } from '@nestjs/common';
import fetch from 'cross-fetch';
import { IGetCharacterZoneRankingsRequest } from '../character/requests';
import { CharacterData } from './common';
import { GetWclCharacterZoneRankingsResponse } from './service/get-wcl-character-zone-rankings-response.interface';

@Injectable()
export class WarcraftLogsService {
  private apollo: ApolloClient<any>;

  constructor() {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ODAwMmM4ZS0wYjY0LTRjMTktYmM4MS0yYWExOWQ2OWRiZmUiLCJqdGkiOiJmZDg5ZTMyODg3ZWRlZWI2NmJmZGU5M2VkZWEyNzgzYTc5MDQ1NDQxNGE2NDRjMmQwNzA2MTE5M2FhMDI4YjNmOWY0M2EwZTVkN2Q4Mjk5YiIsImlhdCI6MTY3NTM1NzM1MC4wNzI5MDUsIm5iZiI6MTY3NTM1NzM1MC4wNzI5MDgsImV4cCI6MTcwNjQ2MTM1MC4wMjkwNDksInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.lnnzCpbMVQOT6ZlLEmzCb5zZuKyoNmAIg-fUf0tQZghWrPwat3XsK48Vhq3fHfs6bPLr0txlhxzMyo56L2bIuXN76fa6sDLVMHx4Yi1git1nxW_lGdnm95eHOkxVp6lvHNKRg3HOJkijaNghOHdLpi2zQVbBQVajx6RyWlmCBEp1DjOP5d7OgQV-y8SxnKzhaj7v64lOz0HAxI-z_-NpwqzMz7od4hHQuElNGD6njW4L_uO3CgQ3E8zHnk_1Y_sM8WU_NgfVsObXrRuwyfe83vVsHl5SflVenJWsaq51ViWgTtczXLGR_2mNEQ_eyMdr1bgnCMUYk0WDUAArtkHTy470e38iVALowx14dR-mYxP6JyBIexI7g9hlCor2UVBV8-T8DbMjwIQwXk34JGRZ4SdruQnRtSzM3JSR7ERhCTwVc1IEzopMMI63p168-UD-w6LJ6ihP8rTLsDQnrC-IfCr-Wvr91Uure0d0xiLw_dRc-LEngPqkxAPdMm_wXL3-57o1YPAjO8nMxYktkPrmAq7ORuyzPrU2j3ur_c6ZMHf-cm2kzlh7OPbIJIN0Ryj25W-2fntVyNi8J1m905z17u2P6wqUVzlrwn9ciAu7aQ4ar0TDTRxikzjaZOA_44upJTFYKBnVwDtjpAaXMPxKYzhUygGksMXaesqeGcfPHt8';

    const client = new ApolloClient({
      link: new HttpLink({
        uri: 'https://classic.warcraftlogs.com/api/v2/client',
        fetch,
        credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
        headers: {
          authorization: 'Bearer ' + token
        }
      }),
      cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false
      })
    });
    this.apollo = client;
  }

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
