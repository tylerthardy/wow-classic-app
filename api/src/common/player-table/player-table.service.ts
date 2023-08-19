import { DynamoDBClient, DynamoDBClientConfig, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, PutCommandOutput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { InvalidOperationError, NotFoundError } from 'common-errors';
import { AppConfig } from '../../app-config';
import { IGetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';

@Injectable()
export class PlayerTableService {
  private tableName: string;
  private documentClient: DynamoDBDocumentClient;

  constructor(appConfig: AppConfig) {
    this.tableName = appConfig.dynamoPlayerTableName;
    const configuration: DynamoDBClientConfig = {};
    const ddbClient = new DynamoDBClient(configuration);
    this.documentClient = DynamoDBDocumentClient.from(ddbClient);
  }

  public async storeWclCharacterZoneRankings(
    region: string,
    server: string,
    characterName: string,
    zoneId: number,
    size: number,
    specName: string | undefined,
    lastUpdated: number,
    wclResponse: IGetWclCharacterZoneRankingsResponse
  ): Promise<PutCommandOutput> {
    Logger.log('storing wcl character zone rankings');
    const regionServer: string = this.getRegionServer(region, server);
    const characterNameSpecZoneSize: string = this.getCharacterNameSpecZoneSize(characterName, zoneId, size, specName);
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: {
        pk: regionServer,
        sk: characterNameSpecZoneSize,
        timestamp: lastUpdated,
        wclResponse
      }
    });
    const putResult: PutCommandOutput = await this.documentClient.send(putCommand);
    return putResult;
  }

  public async getCachedCharacterZoneRankings(
    region: string,
    server: string,
    characterName: string,
    zoneId: number,
    size: number,
    specName: string | undefined
  ): Promise<IGetWclCharacterZoneRankingsResponse> {
    Logger.log('getting wcl character zone rankings from the past 24 hours', {
      region,
      server,
      characterName,
      zoneId,
      size
    });
    const regionServer: string = this.getRegionServer(region, server);
    const characterNameSpecZoneSize: string = this.getCharacterNameSpecZoneSize(characterName, zoneId, size, specName);
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: '#kn0 = :kv0 AND #kn1 = :kv1',
      FilterExpression: '#n0 > :v0',
      ExpressionAttributeNames: {
        '#n0': 'timestamp',
        '#kn0': 'pk',
        '#kn1': 'sk'
      },
      ExpressionAttributeValues: {
        ':v0': { N: this.getUnixNowMinusOneDay().toString() },
        ':kv0': { S: regionServer },
        ':kv1': { S: characterNameSpecZoneSize }
      },
      Select: 'ALL_ATTRIBUTES'
    });
    const queryResult: QueryCommandOutput = await this.documentClient.send(queryCommand);
    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new NotFoundError('cached character not found');
    }
    if (queryResult.Items.length > 1) {
      throw new InvalidOperationError('more than one character not found');
    }
    const response: any = unmarshall(queryResult.Items[0]);
    const result: IGetWclCharacterZoneRankingsResponse = response[
      'wclResponse'
    ] as IGetWclCharacterZoneRankingsResponse;
    result.lastUpdated = response['timestamp'];
    return result;
  }

  private getRegionServer(region: string, server: string): string {
    return `${region}#${server}`.toLowerCase();
  }

  private getCharacterNameSpecZoneSize(characterName: string, zoneId: number, size: number, spec?: string): string {
    if (!spec) {
      spec = 'all';
    }
    return `${characterName}#${zoneId}#${size}#${spec}`.trim().toLowerCase();
  }

  private getUnixNowMinusOneDay(): number {
    const now = Date.now();
    const offset = 24 * 60 * 60 * 1000;
    return now - offset;
  }
}
