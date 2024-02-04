import { Controller, Get } from '@nestjs/common';
import { GuildService } from './guild.service';

@Controller('guild')
export class GuildController {
  constructor(private guildService: GuildService) {}

  @Get('encounter-stats')
  public async getEncounterStats(): Promise<any> {
    const guildId = 605040;
    const zoneId = 1020;
    const encounterId = 856;
    const guildTagId = 51766;
    const statsByZone = await this.guildService.getEncounterStatsByZone(guildId, zoneId, encounterId);
    const statsByTag = await this.guildService.getEncounterStatsByTag(guildId, guildTagId, encounterId);

    const players = {};
    Object.entries(statsByZone.players).forEach(([playerName, count]) => {
      players[playerName] = count;
    });
    Object.entries(statsByTag.players).forEach(([playerName, count]) => {
      if (!players[playerName]) players[playerName] = 0;
      players[playerName] += count;
    });

    const dates: string[] = [];
    dates.push(...statsByZone.raidDates);
    dates.push(...statsByTag.raidDates);
    return {
      players,
      dates
    };
  }
}
