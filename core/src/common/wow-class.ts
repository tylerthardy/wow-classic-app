import { Specialization, SpecializationData } from '../specializations';
import { RankingMetric } from '../warcraft-logs';

export type WowRole = 'DPS' | 'Tank' | 'Healer';
export class WowRoleTrue {
  public static DPS = new WowRoleTrue('DPS', 'DAMAGER', 'dps');
  public static TANK = new WowRoleTrue('Tank', 'TANK', 'dps');
  public static HEALER = new WowRoleTrue('Healer', 'HEALER', 'hps');

  public name: string;
  public enumName: string;
  public metric: RankingMetric;

  constructor(name: string, enumName: string, metric: RankingMetric) {
    this.name = name;
    this.enumName = enumName;
    this.metric = metric;
  }

  public static getByEnumName(enumName: string): WowRoleTrue {
    switch (enumName) {
      case 'DAMAGER':
        return WowRoleTrue.DPS;
      case 'TANK':
        return WowRoleTrue.TANK;
      case 'HEALER':
        return WowRoleTrue.HEALER;
      default:
        throw new Error('invalid enum name: ' + enumName);
    }
  }
}

export abstract class WowClass {
  public id: number;
  public warcraftLogsId: number;
  public name: string;
  public slug: string;
  public classIconUrl: string;
  public specializations: SpecializationData[] = [];

  constructor(id: number, warcraftLogsId: number, name: string) {
    this.id = id;
    this.warcraftLogsId = warcraftLogsId;
    this.name = name;
    this.slug = WowClass.normalizeName(name);
    this.classIconUrl = this.getClassIconUrl();
  }
  public abstract getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined;
  public abstract getSpecializations(): Specialization[];

  private getClassIconUrl(): string {
    const zamimgClassName: string = this.name.toLowerCase().replace(' ', '');
    return `https://wow.zamimg.com/images/wow/icons/large/classicon_${zamimgClassName}.jpg`;
  }

  // TODO: De-dupe
  private static normalizeName(name: string): string {
    return name.toUpperCase().replace(' ', '');
  }
}
