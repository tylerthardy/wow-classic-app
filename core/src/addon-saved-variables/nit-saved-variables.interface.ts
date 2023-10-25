export interface INitSavedVariables {
  data: Data;
}

export interface Data {
  NITdatabase: NitDatabase;
}

export interface NitDatabase {
  profileKeys: ProfileKeys;
  global: Global;
}

export type ProfileKeys = { [nameServer: string]: string };

export interface Global {
  NRCLockoutsFrame_relativePoint: string;
  NRCLockoutsFrame_point: string;
  NRCLockoutsFrame_x: number;
  minimapIcon: MinimapIcon;
  lastVersionMsg: number;
  resetCharData: boolean;
  charsMinLevel: number;
  NRCLockoutsFrame_y: number;
  showPvpLog: boolean;
  // Eranikus: Eranikus;
  // [key: string]: ServerData;
}

export interface NitInstance {
  GUID?: string;
  leftMoney: number;
  group: any;
  class: string;
  leftTime: number;
  groupAverage?: number;
  enteredXP: number;
  xpFromChat: number;
  zoneID?: number;
  mergeSource?: string;
  mobCountFromKill: number;
  GUIDSource?: string;
  enteredMoney: number;
  leftXP?: number;
  playerName: string;
  classEnglish: string;
  rep: any;
  enteredTime: number;
  instanceID: number;
  difficultyID: number;
  leftLevel?: number;
  rawMoneyCount: number;
  instanceName: string;
  mergeGUID?: string;
  mobCount: number;
  enteredLevel: number;
}

export interface MinimapIcon {
  minimapPos: number;
}

export interface ServerData {
  trades: Trade[];
  weeklyResetTime: number;
  myChars: MyChars;
  instances: NitInstance[];
}

export interface Trade {
  targetMoney: number;
  playerMoney: number;
  time: number;
  tradeWho: string;
  where: string;
  tradeWhoClass: string;
}

export type MyChars = { [charName: string]: CharData };

export interface CharData {
  '6265': number;
  fishingSkill: number;
  cookingSkill: number;
  profSkill1: number;
  instances: NitInstances;
  durabilityAverage: number;
  prof2: string;
  savedInstances: SavedInstances;
  honor: number;
  maxXP: number;
  gender: string;
  prof1: string;
  restedXP: number;
  totalBagSlots: number;
  freeBagSlots: number;
  arenaPoints: number;
  guild: string;
  raceEnglish: string;
  profSkillMax1: number;
  resting: boolean;
  time: number;
  gold: number;
  profSkillMax2: number;
  classLocalized: string;
  profSkill2: number;
  realm: string;
  firstaidSkillMax: number;
  currentXP: number;
  raceLocalized: string;
  fishingSkillMax: number;
  playerName: string;
  classEnglish: string;
  marks: Marks;
  race: string;
  level: number;
  cookingSkillMax: number;
  firstaidSkill: number;
  cooldowns: Cooldowns;
  guildRankName: string;
  quests: any[];
  currency: Currency;
}

export interface SavedInstance {
  locked: boolean;
  resetTime: number;
  name: string;
  difficultyName: string;
}

export interface CurrencyInfo {
  max: number;
  name: string;
  count: number;
}

export type NitInstances = { [key: string]: number };
export type SavedInstances = { [key: string]: SavedInstance };
export type Marks = { [key: string]: number };
export type Cooldowns = { [key: string]: number };
export type Currency = { [key: string]: CurrencyInfo };
