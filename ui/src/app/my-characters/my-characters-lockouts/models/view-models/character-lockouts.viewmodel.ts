import { Raid, Raids, WowClass, WowClasses } from 'classic-companion-core';
import { CharacterRaidStatus } from '../character-raid-status.model';
import { MyCharacterLockoutSaveLockout } from '../imports/my-characters-lockouts-save.interface';
import { NitImportLockout } from '../imports/nit-import.interface';

export class CharacterLockoutsViewModel {
  public characterName: string;
  public wowClass?: WowClass;
  public hidden: boolean = false;
  public raidStatuses: Map<Raid, CharacterRaidStatus> = new Map();

  constructor(
    characterName: string,
    classSlug: string | undefined,
    lockoutData: NitImportLockout[] | MyCharacterLockoutSaveLockout[],
    hidden?: boolean
  ) {
    this.characterName = characterName;
    this.wowClass = classSlug ? WowClasses.getClassBySlug(classSlug) : undefined;
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
}
