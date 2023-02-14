import { Module } from '@nestjs/common';
import { WarcraftLogsService } from './warcraft-logs.service';

@Module({
  controllers: [],
  providers: [WarcraftLogsService],
  imports: []
})
export class WarcraftLogsModule {}
