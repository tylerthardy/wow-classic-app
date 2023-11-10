import { DynamoDBClient, DynamoDBClientConfig, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, PutCommandOutput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { InvalidOperationError, NotFoundError } from 'common-errors';
import { AppConfig } from '../../app-config';
import { IMyCharacterSave } from '../../my-character/my-character.service';

@Injectable()
export class MyCharactersTableService {
  private tableName: string;
  private documentClient: DynamoDBDocumentClient;

  constructor(appConfig: AppConfig) {
    this.tableName = appConfig.dynamoMyCharactersTableName;
    // TODO: Provider should handle all of this, so we're only injecting doc client
    const configuration: DynamoDBClientConfig = {};
    const ddbClient = new DynamoDBClient(configuration);
    this.documentClient = DynamoDBDocumentClient.from(ddbClient);
  }

  public async storeMyCharacter(
    username: string,
    region: string,
    server: string,
    characterName: string,
    characterData: IMyCharacterSave
  ): Promise<PutCommandOutput> {
    Logger.log('storing my-character', { username, characterName, region, server });
    const regionServerName: string = this.getRegionServerName(region, server, characterName);
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: {
        pk: username,
        sk: regionServerName,
        characterName,
        characterData
      }
    });
    const putResult: PutCommandOutput = await this.documentClient.send(putCommand);
    return putResult;
  }

  public async getAllMyCharacters(username: string): Promise<IMyCharacterSave[]> {
    Logger.log('getting all my-characters', { username });
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: '#kn0 = :kv0',
      ExpressionAttributeNames: {
        '#kn0': 'pk'
      },
      ExpressionAttributeValues: {
        ':kv0': { S: username }
      },
      Select: 'ALL_ATTRIBUTES'
    });
    const queryResult: QueryCommandOutput = await this.documentClient.send(queryCommand);
    if (!queryResult.Items) {
      throw new InvalidOperationError(
        "database response missing items collection - it may not be empty; it's just not present"
      );
    }
    const result: IMyCharacterSave[] = queryResult.Items.map((item) => {
      const unmarshalledItem = unmarshall(item);
      return unmarshalledItem['characterData'] as IMyCharacterSave;
    });
    return result;
  }

  public async getMyCharacter(
    username: string,
    region: string,
    server: string,
    characterName: string
  ): Promise<IMyCharacterSave> {
    Logger.log('getting my-character', { characterName, region, server });
    const regionServerCharacterName: string = this.getRegionServerName(region, server, characterName);
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: '#kn0 = :kv0 AND #kn1 = :kv1',
      ExpressionAttributeNames: {
        '#kn0': 'pk',
        '#kn1': 'sk'
      },
      ExpressionAttributeValues: {
        ':kv0': { S: username },
        ':kv1': { S: regionServerCharacterName }
      },
      Select: 'ALL_ATTRIBUTES'
    });
    const queryResult: QueryCommandOutput = await this.documentClient.send(queryCommand);
    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new NotFoundError('my-character not found');
    }
    if (queryResult.Items.length > 1) {
      throw new InvalidOperationError('more than one my-character not found');
    }
    const response: any = unmarshall(queryResult.Items[0]);
    const result: any = response['characterData'] as any;
    return result;
  }

  private getRegionServerName(region: string, server: string, characterName: string): string {
    return `${region}#${server}#${characterName}`.toLowerCase();
  }
}
