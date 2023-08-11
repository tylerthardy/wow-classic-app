import { Controller, NotFoundException, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import {
  IGetCharacterZoneRankingsResponse,
  IGetCharacterZoneRankingsWithSpecResponse,
  IGetMultipleCharacterZoneRankingsResponse,
  WowRoleTrue
} from 'classic-companion-core';
import { NotFoundError } from 'common-errors';
import { CharacterService } from './character.service';
import { GetCharacterZoneRankingsRequest, GetMultipleCharacterZoneRankingsRequest } from './requests';

@Controller('character')
export class CharacterController {
  constructor(private service: CharacterService) {}

  @Post()
  public async getCharacterZoneRankings(
    @Body() request: GetCharacterZoneRankingsRequest
  ): Promise<IGetCharacterZoneRankingsResponse> {
    try {
      return await this.service.getCharacterZoneRankings(request);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('class-role')
  // TODO: Fix request type
  // TODO: Need to be caching spec now
  public async getCharacterZoneRankingsByClassRole(
    @Body() request: any
  ): Promise<IGetCharacterZoneRankingsWithSpecResponse> {
    try {
      if (request.role === 'DAMAGER') {
        request.role = WowRoleTrue.DPS;
      }
      if (request.role === 'HEALER') {
        request.role = WowRoleTrue.HEALER;
      }
      if (request.role === 'TANK') {
        request.role = WowRoleTrue.TANK;
      }
      return await this.service.getCharacterZoneRankingsByClassRole(request);
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
