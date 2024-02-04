import { Module } from '@nestjs/common';
import { WarcraftLogsModule } from '../warcraft-logs/warcraft-logs.module';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';

@Module({
  providers: [GuildService],
  imports: [WarcraftLogsModule],
  controllers: [GuildController]
})
export class GuildModule {}
