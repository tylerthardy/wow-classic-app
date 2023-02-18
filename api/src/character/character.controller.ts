import { Controller, NotFoundException, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { NotFoundError } from 'common-errors';
import { IGetMultipleCharacterZoneRankingsResponse } from '../../../models/api';
import { CharacterService } from './character.service';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';
import { GetCharacterZoneRankingsResponse } from './responses';

@Controller('character')
export class CharacterController {
  constructor(private service: CharacterService) {}

  @Post()
  public async getCharacterZoneRankings(
    @Body() request: GetCharacterZoneRankingsRequest
  ): Promise<GetCharacterZoneRankingsResponse> {
    try {
      return await this.service.getCharacterZoneRankings(request);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('multiple')
  public async getMultipleCharacterZoneRankings(
    @Body() request: GetMultipleCharacterZoneRankingsRequest
  ): Promise<IGetMultipleCharacterZoneRankingsResponse> {
    return await this.service.getMultipleCharactersZoneRankings(request);
  }
}
