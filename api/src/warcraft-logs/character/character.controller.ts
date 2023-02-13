import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { CharacterService } from './character.service';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsResponse, IGetMultipleCharacterZoneRankingsResponse } from './responses';

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
  public async getMultipleCharacterZoneRankings(
    @Body() request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<IGetMultipleCharacterZoneRankingsResponse> {
    return {
      characters: await this.service.getMultipleCharactersZoneRankings(request)
    };
  }
}
