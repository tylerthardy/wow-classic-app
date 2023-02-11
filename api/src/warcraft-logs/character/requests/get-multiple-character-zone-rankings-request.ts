import { Type } from 'class-transformer';
import { IsArray, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { GetCharacterZoneRankingsRequest } from './get-character-zone-rankings-request';
import { IGetMultipleCharacterZoneRankingsRequest } from './get-multiple-character-zone-rankings-request.interface';

export class GetMultipleCharacterZoneRankingsRequest implements IGetMultipleCharacterZoneRankingsRequest {
  @IsArray()
  @MinLength(1)
  @MaxLength(40)
  @ValidateNested({ each: true })
  @Type(() => GetCharacterZoneRankingsRequest)
  characters: GetCharacterZoneRankingsRequest[];
}
