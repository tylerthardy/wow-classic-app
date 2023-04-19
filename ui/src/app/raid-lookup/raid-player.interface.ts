import { RaidPlayerRole } from './raid-player-role.type';

// FIXME: DEPRECATE THIS
export interface JsonRaidPlayer {
  name: string;
  role: RaidPlayerRole;
  classFileName: string;
}

export interface JsonRaidPlayerV2 {
  name: string;
  roles: [number, number, number];
  // TODO: Enum to represent these on both sides
  class: string;
}
