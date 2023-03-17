import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
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
    wclResponse: IGetWclCharacterZoneRankingsResponse
  ): Promise<PutCommandOutput> {
    Logger.log('storing wcl character zone rankings');
    const regionServer: string = `${region}-${server}`;
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: { regionServer, characterName, timestamp: Date.now().valueOf(), wclResponse }
    });
    const putResult: PutCommandOutput = await this.documentClient.send(putCommand);
    return putResult;
  }
}
