import { Injectable } from '@angular/core';
import { forkJoin, mergeMap, Observable } from 'rxjs';
import { Report } from '../common/services/graphql';
import { GuildLogsService } from '../common/services/guild-logs.service';
import { ReportSummary } from '../common/services/ReportSummary';
import { GuildReport } from '../guild-log/guild-report';
import { ReportPlayerDeath } from './ReportPlayerDeath';

@Injectable({
  providedIn: 'root'
})
export class GuildLogsSummaryService {
  constructor(private service: GuildLogsService) {}

  public getGuildReports(
    guildName: string,
    serverSlug: string,
    serverRegion: string,
    limit: number
  ): Observable<Report[]> {
    return this.service.getGuildId(guildName, serverSlug, serverRegion).pipe(
      mergeMap((guildId: number) => this.service.getGuildReports(guildId, limit)),
      mergeMap((guildReports: ReportSummary[]) =>
        forkJoin(guildReports.map((report: ReportSummary) => this.service.getReport(report.code, 'Deaths')))
      )
    );
  }

  public getReportPlayerDeaths(reports: GuildReport[]): ReportPlayerDeath[] {
    let result: ReportPlayerDeath[] = [];

    reports.forEach((report: GuildReport) => {
      result = result.concat(report.getReportPlayerDeaths());
    });

    return result;
  }
}
