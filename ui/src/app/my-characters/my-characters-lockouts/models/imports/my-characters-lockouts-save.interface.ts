// TODO: Remove interfaces?
interface IMyCharactersLockoutsSave {
  version: string;
  showHidden: boolean;
  characters: IMyCharactersLockoutsSaveCharacter[];
}

export class MyCharactersLockoutsSave implements IMyCharactersLockoutsSave {
  public version: string;
  public showHidden: boolean;
  public characters: MyCharactersLockoutsSaveCharacter[];

  constructor(data: IMyCharactersLockoutsSave) {
    this.version = data.version;
    this.showHidden = data.showHidden;
    this.characters = data.characters.map((character) => new MyCharactersLockoutsSaveCharacter(character));
  }
}

interface IMyCharactersLockoutsSaveCharacter {
  characterName: string;
  classSlug: string;
  hidden: boolean;
  lockouts: IMyCharacterLockoutSaveLockout[];
}

interface IMyCharacterLockoutSaveLockout {
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
  public classSlug: string;
  public hidden: boolean;
  public lockouts: MyCharacterLockoutSaveLockout[];

  constructor(data: IMyCharactersLockoutsSaveCharacter) {
    this.characterName = data.characterName;
    this.classSlug = data.classSlug;
    this.hidden = data.hidden;
    this.lockouts = data.lockouts.map((lockout) => new MyCharacterLockoutSaveLockout(lockout));
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
