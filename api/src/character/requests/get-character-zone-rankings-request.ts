import { IsIn, IsNumber, IsString } from 'class-validator';
import { IsWowUsername } from '../../common/validators/is-wow-username.validator';
import { RaidSize, RaidSizeValues, RankingMetric, RankingMetricValues } from '../../warcraft-logs/common';
import { IGetCharacterZoneRankingsRequest } from './get-character-zone-rankings-request.interface';

export class GetCharacterZoneRankingsRequest implements IGetCharacterZoneRankingsRequest {
  @IsWowUsername()
  characterName: string;

  @IsString()
  serverSlug: string;

  @IsString()
  serverRegion: string;

  // TODO: Enum eventually
  @IsNumber()
  zoneId: number;

  @IsIn(RankingMetricValues)
  metric: RankingMetric;

  // TODO: Enum eventually
  @IsString()
  classFileName: string;

  @IsIn(RaidSizeValues)
  size: RaidSize;
}
