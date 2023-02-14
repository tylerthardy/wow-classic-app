import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { GetCharacterZoneRankingsRequest } from './get-character-zone-rankings-request';
import { IGetMultipleCharacterZoneRankingsRequest } from './get-multiple-character-zone-rankings-request.interface';

export class GetMultipleCharacterZoneRankingsRequest implements IGetMultipleCharacterZoneRankingsRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GetCharacterZoneRankingsRequest)
  characters: GetCharacterZoneRankingsRequest[];
}
