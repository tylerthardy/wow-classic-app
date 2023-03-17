import { Module } from '@nestjs/common';
import { SpecializationController } from './specialization.controller';
import { SpecializationService } from './specialization.service';

@Module({
  providers: [SpecializationService],
  controllers: [SpecializationController]
})
export class SpecializationModule {}
