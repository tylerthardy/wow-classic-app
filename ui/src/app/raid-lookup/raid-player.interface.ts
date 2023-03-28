import { RaidPlayerRole } from './raid-player-role.type';

export interface JsonRaidPlayer {
  name: string;
  role: RaidPlayerRole;
  classFileName: string;
}

export interface JsonRaidPlayerV2 {
  name: string;
  roles: [number, number, number];
  class: string;
}
