import {
  IMyCharactersLockoutsSaveCharacter,
  MyCharacterLockoutSaveLockout,
  Raid,
  Raids,
  WowClass,
  WowClasses
} from 'classic-companion-core';
import { CharacterRaidStatus } from '../character-raid-status.model';
import { NitImportLockout } from '../imports/nit-import.interface';

export class CharacterLockoutsViewModel {
  public characterName: string;
  public wowClass?: WowClass;
  public hidden: boolean = false;
  public raidStatuses: Map<Raid, CharacterRaidStatus> = new Map();
  public currencies: { [id: number]: number } = {};

  constructor(
    characterName: string,
    classSlug: string | undefined,
    lockoutData: NitImportLockout[] | MyCharacterLockoutSaveLockout[],
    currencies: { [id: number]: number },
    hidden?: boolean
  ) {
    this.characterName = characterName;
    this.wowClass = classSlug ? WowClasses.getClassBySlug(classSlug) : undefined;
    this.currencies = currencies;
    this.hidden = hidden ?? this.hidden;

    const loadedRaidStatuses: CharacterRaidStatus[] = lockoutData.map((data) => new CharacterRaidStatus(data));
    const statusPerRaid: Map<Raid, CharacterRaidStatus> = new Map();
    loadedRaidStatuses.forEach((status) => {
      if (status.raid === undefined) {
        return;
      }
      statusPerRaid.set(status.raid, status);
    });

    Raids.All.forEach((raid) => {
      const raidStatus: CharacterRaidStatus = statusPerRaid.get(raid) ?? new CharacterRaidStatus();
      this.raidStatuses.set(raid, raidStatus);
    });
  }

  public getSaveableData(): IMyCharactersLockoutsSaveCharacter {
    const character: IMyCharactersLockoutsSaveCharacter = {
      characterName: this.characterName,
      classSlug: this.wowClass?.slug,
      hidden: this.hidden,
      lockouts: [],
      currencies: this.currencies
    };
    for (const kvp of this.raidStatuses.entries()) {
      const raid: Raid = kvp[0];
      const lockout: CharacterRaidStatus = kvp[1];
      if (!lockout.completed && !lockout.hasCustomData()) {
        continue;
      }
      const data = {
        raidSlug: raid.slug,
        itemsNeeded: lockout.itemsNeeded,
        needsToRun: lockout.needsToRun,
        manuallyCompletedOn: lockout.manuallyCompletedOn,
        expires: lockout.expires,
        scheduledDay: lockout.scheduledDay,
        scheduledTime: lockout.scheduledTime,
        notes: lockout.notes
      };
      character.lockouts.push(data);
    }
    return character;
  }
}
