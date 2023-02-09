import { HardReserve } from './common/hard-reserve.interface';

export interface HardReserveOptions {
  hardReserves: HardReserve[];
  raidId: string; //TODO: Move into the softres service
  token: string; //TODO: Move into the softres service
}
