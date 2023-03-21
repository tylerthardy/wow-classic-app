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
    wclResponse: IGetWclCharacterZoneRankingsResponse
  ): Promise<PutCommandOutput> {
    Logger.log('storing wcl character zone rankings');
    const regionServerCharacterName: string = this.getRegionServerCharacterName(region, server, characterName);
    const zoneAndSize: string = this.getZoneAndSize(zoneId, size);
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: { regionServerCharacterName, zoneAndSize, timestamp: Date.now().valueOf(), wclResponse }
    });
    const putResult: PutCommandOutput = await this.documentClient.send(putCommand);
    return putResult;
  }

  public async getCachedCharacterZoneRankings(
    region: string,
    server: string,
    characterName: string,
    zoneId: number,
    size: number
  ): Promise<IGetWclCharacterZoneRankingsResponse> {
    Logger.log('getting wcl character zone rankings from the past 24 hours', {
      region,
      server,
      characterName,
      zoneId,
      size
    });
    const regionServerCharacterName: string = this.getRegionServerCharacterName(region, server, characterName);
    const zoneAndSize: string = this.getZoneAndSize(zoneId, size);
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: '#kn0 = :kv0 AND #kn1 = :kv1',
      FilterExpression: '#n0 > :v0',
      ExpressionAttributeNames: {
        '#n0': 'timestamp',
        '#kn0': 'regionServerCharacterName',
        '#kn1': 'zoneAndSize'
      },
      ExpressionAttributeValues: {
        ':v0': { N: this.getUnixNowMinusOneDay().toString() },
        ':kv0': { S: regionServerCharacterName },
        ':kv1': { S: zoneAndSize }
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
    const response: IGetWclCharacterZoneRankingsResponse = unmarshall(queryResult.Items[0])[
      'wclResponse'
    ] as IGetWclCharacterZoneRankingsResponse;
    return response;
  }

  private getRegionServerCharacterName(region: string, server: string, characterName: string): string {
    return `${region}-${server}-${characterName}`.toLowerCase();
  }

  private getZoneAndSize(zoneId: number, size: number): string {
    return `${zoneId}-${size}`.toLowerCase();
  }

  private getUnixNowMinusOneDay(): number {
    const now = Date.now();
    const offset = 24 * 60 * 60 * 1000;
    return now - offset;
  }
}
