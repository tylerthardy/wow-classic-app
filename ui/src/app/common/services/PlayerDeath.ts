import { ReportPlayerDetails } from './graphql';
import { ReportDeathEvent } from './graphql/ReportDeathEvent';

export interface PlayerDeath extends ReportDeathEvent {
  playerDetails: ReportPlayerDetails;
}
