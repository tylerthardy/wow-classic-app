import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { CharacterService } from './character.service';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsResponse } from './responses';

@Controller()
export class CharacterController {
  constructor(private service: CharacterService) {}

  @Post()
  public getCharacterZoneRankings(
    @Body() request: GetCharacterZoneRankingsRequest
  ): Promise<GetCharacterZoneRankingsResponse> {
    return this.service.getCharacterZoneRankings(request);
  }

  @Post('multiple')
  public getMultipleCharacterZoneRankings(
    @Body() request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<GetCharacterZoneRankingsResponse[]> {
    return this.service.getMultipleCharactersZoneRankings(request);
  }
}
