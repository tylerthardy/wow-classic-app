import { Module } from '@nestjs/common';
import { WarcraftLogsService } from './warcraft-logs.service';

@Module({
  exports: [WarcraftLogsService],
  providers: [WarcraftLogsService]
})
export class WarcraftLogsModule {}
