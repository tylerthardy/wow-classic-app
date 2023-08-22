import { Raid, Raids } from 'classic-companion-core';
import { Lockout } from './lockout.model';
import { INitImportLockout } from './nit-import-lockout.interface';

export class RaidColumnData {
  public raid: Raid;
  public completed: boolean;
  public expires?: number;
  public itemsNeeded: string[] = [];
  public scheduledDay?: string;
  public scheduledTime?: string;
  public needsToRun: boolean = true;

  constructor(raid: Raid, lockoutData: Lockout | undefined) {
    this.raid = raid;
    if (lockoutData) console.log(lockoutData!.resetTime * 1000, Date.now());
    this.completed = lockoutData?.resetTime !== undefined && lockoutData.resetTime * 1000 > Date.now();
    this.expires = lockoutData?.resetTime;
  }
}

export class CharacterLockoutsViewModel {
  public characterName: string;
  public hidden: boolean = false;
  public raidColumns: Map<Raid, RaidColumnData> = new Map();
  private raids: Raid[] = [Raids.Ulduar10, Raids.Ulduar10, Raids.Ulduar25, Raids.ToGC10, Raids.ToGC25];

  constructor(characterName: string, lockouts: Lockout[]) {
    this.characterName = characterName;

    const raidToLockout: Map<Raid, Lockout> = new Map();
    lockouts.forEach((lockout) => {
      if (!lockout.raid) return;
      raidToLockout.set(lockout.raid, lockout);
    });

    Raids.All.forEach((raid) => {
      const lockoutData: Lockout | undefined = raidToLockout.get(raid);
      this.raidColumns.set(raid, new RaidColumnData(raid, lockoutData));
    });
  }
}

export class MyCharactersLockoutsViewModel {
  public data: CharacterLockoutsViewModel[];
  public showHidden: boolean = false;

  public get filteredData(): CharacterLockoutsViewModel[] {
    return this.data.filter((x) => !x.hidden || !this.showHidden);
  }

  constructor(lockouts: { [key: string]: INitImportLockout[] }) {
    // TODO: REFACTOR THIS. Seems like a lot of iterating & transforming for something simple
    const characterLockouts: { [characterName: string]: Lockout[] } = {};
    for (const characterName of Object.keys(lockouts)) {
      const lockoutData: INitImportLockout[] = lockouts[characterName];
      characterLockouts[characterName] = [];

      lockoutData.forEach((lockoutDatum) => {
        const lockout: Lockout = new Lockout(lockoutDatum);
        if (!!lockout.raid) {
          characterLockouts[characterName].push(lockout);
        }
      });
    }

    this.data = Object.entries(characterLockouts).map((kvp) => {
      const characterName: string = kvp[0];
      const lockouts: Lockout[] = kvp[1];
      return new CharacterLockoutsViewModel(characterName, lockouts);
    });
  }
}
