import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql, TypedDocumentNode } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { PaginatedReportData } from '../../guild-log/PaginatedReportData';
import { EventDataType, GuildData, Report, ReportData } from './graphql';
import { ReportSummary } from './ReportSummary';

@Injectable({
  providedIn: 'root'
})
export class GuildLogsService {
  constructor(private apollo: Apollo) {}

  public getGuildId(name: string, serverSlug: string, serverRegion: string): Observable<number> {
    const GET_GUILD: TypedDocumentNode<GuildData, unknown> = gql`
      query {
        guildData {
          guild(name: "${name}", serverSlug:"${serverSlug}", serverRegion:"${serverRegion}") {
            id
          }
        }
      }
    `;
    return this.apollo
      .query({ query: GET_GUILD })
      .pipe(map((result: ApolloQueryResult<GuildData>) => result.data.guildData.guild.id));
  }

  public getGuildReports(guildId: number, limit: number = 15, startPage?: number): Observable<ReportSummary[]> {
    const GET_GUILD_REPORTS: TypedDocumentNode<PaginatedReportData, unknown> = gql`
      query {
        reportData {
          reports(guildID: ${guildId}, limit: ${limit} ${startPage ? ', startPage:' + startPage : ''}) {
            data {
              title
              code
              startTime
            }
            current_page
            last_page
          }
        }
      }
    `;
    return this.apollo
      .query({ query: GET_GUILD_REPORTS })
      .pipe(map((result: ApolloQueryResult<PaginatedReportData>) => result.data.reportData.reports.data));
  }

  public getReport(reportCode: string, eventType: EventDataType): Observable<Report> {
    const GET_FIGHTS: TypedDocumentNode<ReportData, unknown> = gql`
      query {
        reportData {
          report(code: "${reportCode}") {
            code
            startTime
            playerDetails(
              startTime: 0
              endTime: 200000000
              killType: Encounters
            )
            events(
              startTime: 0
              endTime: 200000000
              killType: Encounters
              dataType: ${eventType}
            ) {
              data
            }
            fights(killType: Encounters) {
              id
              encounterID
              startTime
            }
          }
        }
      }
    `;

    return this.apollo
      .query({ query: GET_FIGHTS })
      .pipe(map((result: ApolloQueryResult<ReportData>) => result.data.reportData.report));
  }
}
