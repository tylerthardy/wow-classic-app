import { Injectable } from '@nestjs/common';
import { IGuildEncounterReport, WarcraftLogsService } from '../warcraft-logs/warcraft-logs.service';

enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}

@Injectable()
export class GuildService {
  constructor(private warcraftLogsService: WarcraftLogsService) {}

  public async getEncounterStatsByZone(
    guildId: number,
    zoneId: number,
    encounterId: number
  ): Promise<{
    players: {
      [playerName: string]: number;
    };
    raidDates: string[];
  }> {
    const result = await this.warcraftLogsService.getGuildEncounters(guildId, zoneId, encounterId, true);
    const allLogs = result.reportData.reports.data;
    const filteredLogs = allLogs.filter((l) => this.meetsRaidCriteria(l));
    const dedupedLogs = this.dedupeLogsByDate(filteredLogs);
    const players = await this.getPlayerFightsForEncounter(dedupedLogs, encounterId);
    const raidDates = dedupedLogs.map((l) => new Date(l.startTime).toLocaleDateString());
    return {
      players,
      raidDates
    };
  }

  public async getEncounterStatsByTag(guildId: number, tagId: number, encounterId: number): Promise<any> {
    const result = await this.warcraftLogsService.getGuildEncountersByTag(guildId, tagId, encounterId, true);
    const allLogs = result.reportData.reports.data;
    const filteredLogs = allLogs.filter((l) => this.meetsRaidCriteria(l));
    const dedupedLogs = this.dedupeLogsByDate(filteredLogs);
    const players = await this.getPlayerFightsForEncounter(dedupedLogs, encounterId);
    const raidDates = dedupedLogs.map((l) => new Date(l.startTime).toLocaleDateString());
    return {
      players,
      raidDates
    };
  }

  private async getPlayerFightsForEncounter(
    logs: IGuildEncounterReport[],
    encounterId: number
  ): Promise<{ [playerName: string]: number }> {
    const players: { [playerName: string]: number } = {};

    const logRequests = logs.map((log) => this.warcraftLogsService.getReportEncounterPlayerDetails(log, encounterId));
    try {
      const results = await Promise.all(logRequests);
      results.forEach((details) => {
        const roles = details.reportData.report.playerDetails.data.playerDetails;
        const allPlayers = [...roles.dps, ...roles.healers, ...roles.tanks];
        allPlayers.forEach((player) => {
          const playerName = player.name;
          if (!players[playerName]) {
            players[playerName] = 0;
          }
          players[playerName] += player.specs.map((s) => s.count).reduce((cumsum, a) => cumsum + a, 0);
        });
      });
    } catch (err) {
      throw new Error('error when fetching player encounters ' + err);
    }

    return players;
  }

  private meetsRaidCriteria(record: IGuildEncounterReport): boolean {
    // Raid on Tues or Thurs
    const startDate = new Date(record.startTime);
    if (startDate.getDay() !== Day.TUESDAY && startDate.getDay() !== Day.THURSDAY) {
      return false;
    }
    // No 25 man encounter in the report
    if (!record.fights.find((f) => f.size === 25)) {
      return false;
    }

    return true;
  }

  private dedupeLogsByDate(logs: IGuildEncounterReport[]): IGuildEncounterReport[] {
    const logsByMonthDate: { [m: number]: { [d: number]: IGuildEncounterReport[] } } = {};
    logs.forEach((log) => {
      const startMonth: number = new Date(log.startTime).getMonth();
      if (!logsByMonthDate[startMonth]) logsByMonthDate[startMonth] = {};
      const startDate: number = new Date(log.startTime).getDate();
      if (!logsByMonthDate[startMonth][startDate]) logsByMonthDate[startMonth][startDate] = [];
      logsByMonthDate[startMonth][startDate].push(log);
    });

    const dedupedLogs: IGuildEncounterReport[] = [];
    Object.entries(logsByMonthDate).forEach(([_month, days]) => {
      Object.entries(days).forEach(([_day, logs]) => {
        if (logs.length === 1) {
          dedupedLogs.push(...logs);
          return;
        }
        const firstLogFightLength = logs[0].fights.length;
        if (logs.every((l) => l.fights.length === firstLogFightLength)) {
          dedupedLogs.push(logs[0]);
        } else {
          throw new Error('log length mismatch');
        }
      });
    });

    return dedupedLogs;
  }
}
