import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { IGetMultipleCharacterZoneRankingsRequest } from '../../../../models/api/get-multiple-character-zone-rankings-request.interface';
import { GetCharacterZoneRankingsRequest } from './get-character-zone-rankings-request';

export class GetMultipleCharacterZoneRankingsRequest implements IGetMultipleCharacterZoneRankingsRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GetCharacterZoneRankingsRequest)
  characters: GetCharacterZoneRankingsRequest[];
}
