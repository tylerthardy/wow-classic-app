import { IsIn, IsNumber, IsString } from 'class-validator';
import { IGetCharacterZoneRankingsRequest } from '../../../../models/api';
import { RaidSize, RaidSizeValues, RankingMetric, RankingMetricValues } from '../../../../models/warcraft-logs';
import { IsWowUsername } from '../../common/validators/is-wow-username.validator';

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

  @IsIn(RaidSizeValues)
  size: RaidSize;
}
