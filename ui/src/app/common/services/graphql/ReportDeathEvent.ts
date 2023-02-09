import { EventDataType } from './EventDataType';

export interface ReportDeathEvent {
  timestamp: number;
  type: EventDataType;
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  fight: number;
  killerID: number;
  killerInstance: number;
  killingAbilityGameID: number;
}
