import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  public get userPoolId(): string {
    return this.configService.get<string>('COGNITO_USER_POOL_ID')!;
  }
  public get userPoolClientId(): string {
    return this.configService.get<string>('COGNITO_USER_POOL_CLIENT_ID')!;
  }
  public get dynamoMyCharactersTableName(): string {
    return this.configService.get<string>('DYNAMO_MY_CHARACTERS_TABLE_NAME')!;
  }
  public get dynamoPlayerTableName(): string {
    return this.configService.get<string>('DYNAMO_PLAYER_TABLE_NAME')!;
  }
  public get warcraftLogsClientId(): string {
    return this.configService.get<string>('WARCRAFT_LOGS_CLIENT_ID')!;
  }
  public get warcraftLogsClientSecret(): string {
    return this.configService.get<string>('WARCRAFT_LOGS_CLIENT_SECRET')!;
  }
}

export function validateConfig(config: Record<string, unknown>) {
  if (!config['COGNITO_USER_POOL_ID']) {
    throw new Error('COGNITO_USER_POOL_ID missing');
  }
  if (!config['COGNITO_USER_POOL_CLIENT_ID']) {
    throw new Error('COGNITO_USER_POOL_CLIENT_ID missing');
  }
  if (!config['DYNAMO_MY_CHARACTERS_TABLE_NAME']) {
    throw new Error('Environment variable DYNAMO_MY_CHARACTERS_TABLE_NAME is undefined or null');
  }
  if (!config['DYNAMO_PLAYER_TABLE_NAME']) {
    throw new Error('Environment variable DYNAMO_PLAYER_TABLE_NAME is undefined or null');
  }
  if (!config['WARCRAFT_LOGS_CLIENT_ID']) {
    throw new Error('WARCRAFT_LOGS_CLIENT_ID missing');
  }
  if (!config['WARCRAFT_LOGS_CLIENT_SECRET']) {
    throw new Error('WARCRAFT_LOGS_CLIENT_SECRET missing');
  }

  return config;
}
