export interface IGearPlannerData {
  buffs: any[];
  level: number;
  phase: number;
  shapeshiftForm?: number;
  slots: { [key: number]: ISlotData };
  talentHash: string;
  version: number;
  classId?: number;
  raceId?: number;
  genderId?: number;
}
export interface ISlotData {
  item: number;
  enchant?: number;
  gems?: { [key: number]: number };
}
