import {
  IWowSimsExportItem,
  RankingMetric,
  Specialization,
  SpecializationData,
  WowClass,
  WowClasses
} from 'classic-companion-core';
import { CharacterRaidStatus } from './my-characters-lockouts/models/character-raid-status.model';
import { MyCharacterLockoutSaveLockout } from './my-characters-lockouts/models/imports/my-characters-lockouts-save.interface';
import { IStoredCharacter } from './stored-character.interface';

export class Character {
  public name: string;
  public metric: RankingMetric;
  public wowClass: WowClass;
  public specialization?: Specialization;
  public gear: { items: (IWowSimsExportItem | null)[] } = { items: [] };
  public raidStatuses: CharacterRaidStatus[] = [];

  constructor(character: IStoredCharacter) {
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

  public patchLockoutData(statuses: MyCharacterLockoutSaveLockout[]): void {
    this.raidStatuses = statuses.map((statusData) => new CharacterRaidStatus(statusData));
  }

  public patchGearData(data: any): void {}
}
