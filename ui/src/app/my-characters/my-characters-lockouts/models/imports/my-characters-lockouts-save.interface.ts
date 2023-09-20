// TODO: Remove interfaces?
export interface IMyCharactersLockoutsSave {
  version: string;
  showHidden: boolean;
  characters: IMyCharactersLockoutsSaveCharacter[];
}

export class MyCharactersLockoutsSave implements IMyCharactersLockoutsSave {
  public version: string;
  public showHidden: boolean;
  public characters: IMyCharactersLockoutsSaveCharacter[];

  constructor(data: IMyCharactersLockoutsSave) {
    this.version = data.version;
    this.showHidden = data.showHidden;
    this.characters = data.characters;
  }
}

export interface IMyCharactersLockoutsSaveCharacter {
  characterName: string;
  hidden: boolean;
  lockouts: IMyCharacterLockoutSaveLockout[];
}

export interface IMyCharacterLockoutSaveLockout {
  raidSlug: string;
  itemsNeeded: number[];
  needsToRun: boolean;
  manuallyCompletedOn: number;
  expires?: number;
  scheduledDay?: string;
  scheduledTime?: string;
  notes?: string;
}

export class MyCharactersLockoutsSaveCharacter implements IMyCharactersLockoutsSaveCharacter {
  public characterName: string;
  public hidden: boolean;
  public lockouts: IMyCharacterLockoutSaveLockout[];

  constructor(data: IMyCharactersLockoutsSaveCharacter) {
    this.characterName = data.characterName;
    this.hidden = data.hidden;
    this.lockouts = data.lockouts;
  }
}

export class MyCharacterLockoutSaveLockout implements IMyCharacterLockoutSaveLockout {
  public raidSlug: string;
  public itemsNeeded: number[];
  public needsToRun: boolean;
  public manuallyCompletedOn: number;
  public expires?: number;
  public scheduledDay?: string;
  public scheduledTime?: string;
  public notes?: string;

  constructor(data: IMyCharacterLockoutSaveLockout) {
    this.raidSlug = data.raidSlug;
    this.itemsNeeded = data.itemsNeeded;
    this.needsToRun = data.needsToRun;
    this.manuallyCompletedOn = data.manuallyCompletedOn;
    this.scheduledDay = data.scheduledDay;
    this.scheduledTime = data.scheduledTime;
    this.expires = data.expires;
    this.notes = data.notes;
  }
}
