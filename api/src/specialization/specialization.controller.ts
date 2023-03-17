import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetSpecializationBisResponse, IGetSpecializationBisParams, IWowSimsExport } from 'classic-companion-core';
import { NotFoundError } from 'common-errors';
import { SpecializationService } from './specialization.service';

@Controller('specialization')
export class SpecializationController {
  constructor(private specializationService: SpecializationService) {}

  @Get(':class/:specialization/:role/bis')
  public getBis(@Param() params: IGetSpecializationBisParams): GetSpecializationBisResponse {
    try {
      const bisData: IWowSimsExport[] = this.specializationService.getBis(
        params.class,
        params.specialization,
        params.role
      );
      return bisData;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
