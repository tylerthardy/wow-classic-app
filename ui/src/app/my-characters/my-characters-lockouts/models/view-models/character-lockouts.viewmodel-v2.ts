import { Raid, Raids, WowClass, WowClasses } from 'classic-companion-core';
import { CharacterRaidStatus } from '../character-raid-status.model';

export class CharacterLockoutsViewModelV2 {
  public characterName: string;
  public wowClass: WowClass;
  public hidden: boolean = false;
  public raidStatuses: Map<Raid, CharacterRaidStatus> = new Map();

  constructor(characterName: string, classSlug: string, raidStatuses: CharacterRaidStatus[], hidden?: boolean) {
    this.characterName = characterName;
    this.wowClass = WowClasses.getClassBySlug(classSlug);
    this.hidden = hidden ?? this.hidden;

    const statusPerRaid: Map<Raid, CharacterRaidStatus> = new Map();
    raidStatuses.forEach((status) => {
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
