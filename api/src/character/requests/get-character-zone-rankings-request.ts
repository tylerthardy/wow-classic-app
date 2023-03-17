import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsWowUsername } from '../../common/validators/is-wow-username.validator';
import { RaidSize, RaidSizeValues, RankingMetric, RankingMetricValues } from '../../warcraft-logs/common';
import { IGetCharacterZoneRankingsRequest } from './get-character-zone-rankings-request.interface';

export class GetCharacterZoneRankingsRequest implements IGetCharacterZoneRankingsRequest {
  @IsWowUsername()
  characterName!: string;

  @IsString()
  serverSlug!: string;

  @IsString()
  serverRegion!: string;

  // TODO: Enum eventually
  @IsNumber()
  zoneId!: number;

  @IsIn(RankingMetricValues)
  metric!: RankingMetric;

  @IsString()
  @IsOptional()
  specName?: string;

  // FIXME: This just echoed by the API so the UI gets class name
  // TODO: Enum eventually
  @IsString()
  @IsOptional()
  classFileName?: string;

  // FIXME: This just echoed by the API so the UI gets role
  @IsString()
  @IsOptional()
  role?: string;

  @IsIn(RaidSizeValues)
  size!: RaidSize;
}
