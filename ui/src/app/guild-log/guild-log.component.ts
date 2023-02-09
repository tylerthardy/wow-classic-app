import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs';
import { Report } from '../common/services/graphql';
import { GuildLogsService } from '../common/services/guild-logs.service';
import { ReportSummary } from '../common/services/ReportSummary';
import { ZoneEncountersById } from '../common/services/ZoneEncounters';
import { GuildReport } from './guild-report';

@Component({
  selector: 'app-guild-log',
  templateUrl: './guild-log.component.html',
  styleUrls: ['./guild-log.component.scss']
})
export class GuildLogComponent implements OnInit {
  guildName: string = 'Slash Cry';
  serverSlug: string = 'benediction';
  serverRegion: string = 'us';
  guildReports: ReportSummary[] = [];
  guildLoading: boolean = false;

  reportCode: string = '9dptQHFWC6ZjLyMK';
  guildReport: GuildReport | undefined;
  reportLoading: boolean = false;

  zoneEncounters: { [id: number]: { zone: string; name: string } } = ZoneEncountersById;

  constructor(private service: GuildLogsService) {}

  ngOnInit(): void {
    this.searchGuild();
  }

  searchGuild(): void {
    this.guildLoading = true;
    this.service
      .getGuildId(this.guildName, this.serverSlug, this.serverRegion)
      .pipe(mergeMap((guildId: number) => this.service.getGuildReports(guildId)))
      .subscribe((reports: ReportSummary[]) => {
        this.guildReports = reports;
        this.guildLoading = false;
      });
  }

  searchReport(): void {
    this.reportLoading = true;
    this.service.getReport(this.reportCode, 'Deaths').subscribe((report: Report) => {
      this.guildReport = new GuildReport(report);
      this.reportLoading = false;
    });
  }

  openReport(event: MouseEvent, reportCode: string): void {
    event.preventDefault();
    this.reportCode = reportCode;
    this.searchReport();
  }
}
