import {
  ApolloClient,
  ApolloQueryResult,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  TypedDocumentNode
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { Injectable } from '@nestjs/common';
import fetch from 'cross-fetch';
import { AccessToken, ClientCredentials, ModuleOptions } from 'simple-oauth2';
import { AppConfig } from '../app-config';
import { IGetCharacterZoneRankingsRequest } from '../character/requests';
import { CharacterData } from './common';
import { IGetWclCharacterZoneRankingsResponse } from './responses/get-wcl-character-zone-rankings-response.interface';

@Injectable()
export class WarcraftLogsService {
  private apollo: ApolloClient<any>;
  private cachedToken: AccessToken | undefined;
  private debug: boolean = false;
  private clientId: string;
  private clientSecret: string;

  constructor(appConfig: AppConfig) {
    this.clientId = appConfig.warcraftLogsClientId;
    this.clientSecret = appConfig.warcraftLogsClientSecret;

    const authLink = setContext(async (_, { headers }) => {
      const token = await this.getToken();
      if (!token) {
        throw new Error('Unable to obtain WCL token; returned undefined');
      }
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`
        }
      };
    });
    const httpLink: HttpLink = new HttpLink({
      uri: 'https://classic.warcraftlogs.com/api/v2/client',
      fetch: (...requestInfo) => {
        if (!this.debug) {
          return fetch(...requestInfo);
        }
        const [_, options] = requestInfo;
        console.log(`📡${JSON.stringify(options)}`);
        return fetch(...requestInfo);
      }
    });
    const client = new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false
      })
    });
    this.apollo = client;
  }

  public async getToken(): Promise<string> {
    if (this.cachedToken) {
      const token: string = this.cachedToken.token['access_token'] as string;
      console.log('Returned WCL token from cache with length: ' + token.length);
      return token;
    }

    const config: ModuleOptions<'client_id'> = {
      auth: {
        tokenHost: 'https://www.warcraftlogs.com/oauth/token'
      },
      client: {
        id: this.clientId,
        secret: this.clientSecret
      }
    };

    const client = new ClientCredentials(config);
    const tokenParams = {};
    try {
      const accessToken: AccessToken = await client.getToken(tokenParams);
      this.cachedToken = accessToken;
      const token: string = accessToken.token['access_token'] as string;
      console.log('Obtained new WCL token with length: ' + token.length);
      return token;
    } catch (error: any) {
      console.error('Access Token error', error.message);
      throw error;
    }
  }

  public async getWclCharacterZoneRankings(
    request: IGetCharacterZoneRankingsRequest
  ): Promise<IGetWclCharacterZoneRankingsResponse> {
    let additionalQueries: string = '';
    if (request.specName) {
      additionalQueries += `, specName: "${request.specName}"`;
    }
    if (request.difficulty === 'hard') {
      additionalQueries += `, difficulty: 4`;
    } else if (request.difficulty === 'normal') {
      additionalQueries += `, difficulty: 3`;
    }
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
                zoneRankings(zoneID: ${request.zoneId}, metric: ${request.metric}, size: ${request.size}${additionalQueries})
              }
            }
          }
        `;

    let result: ApolloQueryResult<CharacterData>;
    console.log('querying wcl for character');
    try {
      result = await this.apollo.query({
        query: GET_CHARACTER_ZONE_RANKINGS,
        fetchPolicy: 'network-only'
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
    console.log('query complete');

    // FIXME: Hacky. There should be more defined types
    return {
      ...(result.data.characterData.character as IGetWclCharacterZoneRankingsResponse),
      size: request.size
    };
  }

  public async getGuildEncounters(
    guildId: number,
    zoneId: number,
    encounterId: number,
    hardMode: boolean
  ): Promise<IGuildEncounters> {
    const hardModeQuery: string = hardMode ? ',difficulty: 4' : '';

    const GET_GUILD_ENCOUNTERS: TypedDocumentNode<IGuildEncounters, unknown> = gql`
        query {
          reportData {
            reports(guildID:${guildId}, zoneID:${zoneId}) {
              total
              data {
                code
                startTime
                endTime
                fights(encounterID: ${encounterId} ${hardModeQuery}) {
                  id
                  startTime
                  endTime
                  size
                }
                owner {
                  id
                }
              }
            }
          }
        }
      `;

    let result: ApolloQueryResult<IGuildEncounters>;
    console.log('querying wcl for guild reports', {
      guildId,
      zoneId,
      encounterId,
      hardMode
    });
    try {
      result = await this.apollo.query({
        query: GET_GUILD_ENCOUNTERS,
        fetchPolicy: 'network-only'
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
    console.log('guild reports query complete');

    return result.data;
  }

  public async getGuildEncountersByTag(
    guildId: number,
    tagId: number,
    encounterId: number,
    hardMode: boolean
  ): Promise<IGuildEncounters> {
    const hardModeQuery: string = hardMode ? ',difficulty: 4' : '';

    const GET_GUILD_ENCOUNTERS: TypedDocumentNode<IGuildEncounters, unknown> = gql`
        query {
          reportData {
            reports(guildID:${guildId}, guildTagID:${tagId}) {
              total
              data {
                code
                startTime
                endTime
                fights(encounterID: ${encounterId} ${hardModeQuery}) {
                  id
                  startTime
                  endTime
                  size
                }
                owner {
                  id
                }
              }
            }
          }
        }
      `;

    let result: ApolloQueryResult<IGuildEncounters>;
    console.log('querying wcl for guild reports', {
      guildId,
      tagId,
      encounterId,
      hardMode
    });
    try {
      result = await this.apollo.query({
        query: GET_GUILD_ENCOUNTERS,
        fetchPolicy: 'network-only'
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
    console.log('guild reports query complete');

    return result.data;
  }

  public async getReportEncounterPlayerDetails(
    log: IGuildEncounterReport,
    encounterId: number
  ): Promise<IPlayerDetails> {
    const reportCode: string = log.code;
    // Unneeded extra security
    // const fightIds: number[] = log.fights.filter(f => f.encounterID === encounterId).map(f => f.id);
    const fightIds: number[] = log.fights.map((f) => f.id);

    const GET_GUILD_ENCOUNTERS: TypedDocumentNode<IPlayerDetails, unknown> = gql`
      query {
        reportData {
          report(code: "${reportCode}") {
            playerDetails(encounterID: ${encounterId}, fightIDs: [${fightIds.join(',')}])
          }
        }
      }
    `;

    let result: ApolloQueryResult<IPlayerDetails>;
    console.log('querying wcl for report', {
      reportCode,
      encounterId
    });
    try {
      result = await this.apollo.query({
        query: GET_GUILD_ENCOUNTERS,
        fetchPolicy: 'network-only'
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
    console.log('guild reports query complete');

    return result.data;
  }
}

export interface IGuildEncounters {
  reportData: {
    reports: {
      total: number;
      data: IGuildEncounterReport[];
    };
  };
}

export interface IGuildEncounterReport {
  code: string;
  startTime: number;
  endTime: number;
  fights: {
    id: number;
    startTime: number;
    endTime: number;
    size: number;
    // name: string;
    // difficulty: number;
    // encounterID: number;
  }[];
  owner: {
    id: number;
  };
}

export interface IPlayerDetails {
  reportData: {
    report: {
      playerDetails: {
        data: {
          playerDetails: {
            healers: IPlayerDetailsPlayer[];
            tanks: IPlayerDetailsPlayer[];
            dps: IPlayerDetailsPlayer[];
          };
        };
      };
    };
  };
}

export interface IPlayerDetailsPlayer {
  name: string;
  id: number;
  guid: number;
  type: string;
  server: string;
  icon: string;
  specs: {
    spec: string;
    count: number;
  }[];
  minItemLevel: number;
  maxItemLevel: number;
  potionUse: number;
  healthstoneUse: number;
  combatantInfo: any[];
}
