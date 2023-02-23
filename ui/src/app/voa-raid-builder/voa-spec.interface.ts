import { RaidPlayerRole } from '../raid-lookup/raid-player-role.type';

export interface IVoaSpec {
  class: string;
  spec: string;
  lfgClass: string;
  lfgSpec?: string;
  role: RaidPlayerRole;
}
