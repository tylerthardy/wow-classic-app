import { RaidPlayerRole } from './raid-player-role.type';

export interface JsonRaidPlayer {
  name: string;
  role: RaidPlayerRole;
  classFileName: string;
}
