import { ReportSummary } from '../common/services/ReportSummary';

export interface PaginatedReportData {
  reportData: {
    reports: {
      data: ReportSummary[];
      current_page: number;
      last_page: number;
    };
  };
}
