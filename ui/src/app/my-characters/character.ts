import {
  IWowSimsExportItem,
  RankingMetric,
  Specialization,
  SpecializationData,
  WowClass
} from 'classic-companion-core';
import { IStoredCharacter } from './stored-character.interface';

export class Character {
  public name: string;
  public metric: RankingMetric;
  public wowClass: WowClass;
  public specialization: Specialization;
  public gear: { items: (IWowSimsExportItem | null)[] } = { items: [] };

  constructor(character: IStoredCharacter) {
    this.name = character.name;
    this.metric = character.metric;
    this.gear = character.gear;

    const wowClass: WowClass | undefined = WowClass.getClassByName(character.className);
    if (!wowClass) {
      throw new Error('could not find class ' + character.className);
    }
    this.wowClass = wowClass;

    const specData: SpecializationData | undefined = Specialization.getData(wowClass, character.specName);
    if (!specData) {
      throw new Error('could not find spec ' + character.specName);
    }
    this.specialization = new Specialization(specData);
  }
}
