/**
 * Holy crap this is garbage. Make the underlying data a table instead of this nested crap.
 */

import { Component, OnInit } from '@angular/core';
import { Report } from '../common/services/graphql';
import { ZoneEncountersById } from '../common/services/ZoneEncounters';
import { GuildReport, GuildReportDeathEvent } from '../guild-log/guild-report';
import { GuildLogsSummaryService } from './guild-logs-summary.service';
import { ReportPlayerDeath } from './ReportPlayerDeath';

export type DeathByPlayerAndReport = {
  [playerName: string]: { [reportCode: string]: GuildReportDeathEvent[] };
};

export interface ReportDeath {
  report: Report;
  death: GuildReportDeathEvent;
}

@Component({
  selector: 'guild-logs-summary',
  templateUrl: './guild-logs-summary.component.html',
  styleUrls: ['./guild-logs-summary.component.scss']
})
export class GuildLogsSummaryComponent implements OnInit {
  guildName: string = 'Slash Cry';
  serverSlug: string = 'benediction';
  serverRegion: string = 'us';
  limit: number = 20;

  guildReports: GuildReport[] = [];
  logsLoading: boolean = false;
  reportPlayerDeaths: ReportPlayerDeath[] = [];
  filteredReportPlayerDeaths: ReportPlayerDeath[] = [];

  killingAbilityIds: Set<number> = new Set();
  filterKillingAbilityId: number | undefined = 27812;

  zoneEncounters: { [id: number]: { zone: string; name: string } } = ZoneEncountersById;

  constructor(private service: GuildLogsSummaryService) {}

  ngOnInit(): void {
    this.searchGuild();
  }

  public onFilterChanged(): void {
    this.filteredReportPlayerDeaths = this.filterAndSort(
      JSON.parse(JSON.stringify(this.reportPlayerDeaths)),
      this.filterKillingAbilityId
    );
  }

  public searchGuild(): void {
    this.logsLoading = true;
    this.reportPlayerDeaths = [];
    this.filteredReportPlayerDeaths = [];
    this.killingAbilityIds.clear();

    this.service
      .getGuildReports(this.guildName, this.serverSlug, this.serverRegion, this.limit)
      .subscribe((reports: Report[]) => {
        const guildReports: GuildReport[] = reports.map((report) => new GuildReport(report));
        this.guildReports = guildReports;

        this.reportPlayerDeaths = this.service.getReportPlayerDeaths(guildReports);

        this.killingAbilityIds = this.getKillingAbilityGameIds(this.reportPlayerDeaths);

        this.filteredReportPlayerDeaths = this.filterAndSort(
          JSON.parse(JSON.stringify(this.reportPlayerDeaths)),
          this.filterKillingAbilityId
        );

        this.logsLoading = false;
      });
  }

  public getIconClasses(classIcon: string): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {};
    classes['actor-sprite-' + classIcon] = true;
    return classes;
  }

  private getKillingAbilityGameIds(reportPlayerDeaths: ReportPlayerDeath[]): Set<number> {
    const abilityIds: Set<number> = new Set();
    reportPlayerDeaths.forEach((reportPlayerDeath: ReportPlayerDeath) =>
      abilityIds.add(reportPlayerDeath.death.killingAbilityGameID)
    );
    return abilityIds;
  }

  private sortDeaths(deathReports: ReportPlayerDeath[]): ReportPlayerDeath[] {
    return deathReports.sort((a, b) => {
      if (a.player.name === b.player.name) {
        return a.report.startTime > b.report.startTime ? -1 : 1;
      } else {
        return a.player.name < b.player.name ? -1 : 1;
      }
    });
  }

  private filterAndSort(
    deathReports: ReportPlayerDeath[],
    filter_killingAbilityGameID: number | undefined
  ): ReportPlayerDeath[] {
    return this.sortDeaths(
      deathReports.filter((reportPlayerDeath: ReportPlayerDeath) => {
        return (
          !filter_killingAbilityGameID || reportPlayerDeath.death.killingAbilityGameID === filter_killingAbilityGameID
        );
      })
    );
  }
}
