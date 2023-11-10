import { Specialization } from '../../specializations';
import { RankingMetric } from '../../warcraft-logs';
import { WowClass } from '../wow-class';
import { WowClasses } from '../wow-classes';
import { IMyCharacterLockoutSaveLockout } from './my-characters-lockouts-save';

export class MyCharacter {
  public name: string;
  public lockouts: IMyCharacterLockoutSaveLockout[] = [];
  public metric: RankingMetric;
  public wowClass?: WowClass;
  public specialization?: Specialization;

  constructor(name: string, classSlug: string) {
    this.name = name;
    this.metric = 'dps';
    this.wowClass = WowClasses.getClassBySlug(classSlug);
  }
}
