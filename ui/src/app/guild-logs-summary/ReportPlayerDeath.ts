import { Report, ReportPlayerDetails } from '../common/services/graphql';
import { GuildReportDeathEvent } from '../guild-log/guild-report';

export interface ReportPlayerDeath {
  report: Report;
  death: GuildReportDeathEvent; // doesnt need player info
  player: ReportPlayerDetails;
}
