export interface ReportPlayerDetails {
  name: string;
  id: number;
  guid: number;
  type: string;
  server: string;
  icon: string;
  specs: { spec: string; count: number }[];
  minItemLevel: number;
  maxItemLevel: number;
  potionUse: number;
  healthstoneUse: number;
  combatantInfo: [];
}
