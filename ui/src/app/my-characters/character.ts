import {
  IWowSimsExportItem,
  Raid,
  Raids,
  RankingMetric,
  Specialization,
  SpecializationData,
  WowClass,
  WowClasses
} from 'classic-companion-core';
import { CharacterRaidStatus } from './my-characters-lockouts/models/character-raid-status.model';
import { NitImportCharacter } from './my-characters-lockouts/models/imports/nit-import.interface';
import { IStoredCharacter } from './stored-character.interface';

export class Character {
  public name: string;
  public metric: RankingMetric;
  public wowClass: WowClass;
  public specialization?: Specialization;
  public gear: { items: (IWowSimsExportItem | null)[] } = { items: [] };
  public raidStatuses: CharacterRaidStatus[] = this.getBlankRaidStatuses();

  constructor(character: IStoredCharacter) {
    console.log(character);
    this.name = character.name;
    this.metric = character.metric;
    this.gear = character.gear;

    const wowClass: WowClass | undefined = WowClasses.getClassByName(character.className);
    if (!wowClass) {
      throw new Error('could not find class ' + character.className);
    }
    this.wowClass = wowClass;

    const specData: SpecializationData | undefined = Specialization.getData(wowClass, character.specName);
    if (specData) {
      this.specialization = new Specialization(specData);
    }
  }

  public getRaidStatus(raid: Raid): CharacterRaidStatus | undefined {
    return this.raidStatuses.find((status) => status.raid === raid);
  }

  public patchNitImport(incoming: NitImportCharacter): void {
    incoming.instances.forEach((instance) => {
      const importedStatus: CharacterRaidStatus = new CharacterRaidStatus(instance);
      if (!importedStatus.raid) {
        return;
      }
      const existingStatus: CharacterRaidStatus | undefined = this.getRaidStatus(importedStatus.raid);
      if (!existingStatus) {
        this.raidStatuses.push(importedStatus);
        return;
      }
      existingStatus.patchLockout(importedStatus);
    });
  }

  private getBlankRaidStatuses(): CharacterRaidStatus[] {
    return Raids.All.map((raid) => {
      const raidStatus: CharacterRaidStatus = new CharacterRaidStatus();
      raidStatus.raid = raid;
      return raidStatus;
    });
  }
}
