import { ReportDeathEvent } from './ReportDeathEvent';
import { ReportFight } from './ReportFight';
import { ReportPlayerDetails } from './ReportPlayerDetails';

export interface Report {
  code: string;
  startTime: number;
  endTime: number;
  playerDetails: {
    data: {
      playerDetails: {
        healers: ReportPlayerDetails[];
        dps: ReportPlayerDetails[];
        tanks: ReportPlayerDetails[];
      };
    };
  };
  events: {
    data: ReportDeathEvent[];
  };
  fights: ReportFight[];
}
