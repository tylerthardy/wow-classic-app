import { paramCase } from 'change-case';

export type WowRole = 'DPS' | 'Tank' | 'Healer';

export class WowClass {
  public id: number;
  public warcraftLogsId: number;
  public name: string;
  public slug: string;
  public classIconUrl: string;

  constructor(id: number, warcraftLogsId: number, name: string) {
    this.id = id;
    this.warcraftLogsId = warcraftLogsId;
    this.name = name;
    this.slug = WowClass.normalizeName(name);
    this.classIconUrl = this.getClassIconUrl();
  }

  private getClassIconUrl(): string {
    const zamimgClassName: string = this.name.toLowerCase().replace(' ', '');
    return `https://wow.zamimg.com/images/wow/icons/large/classicon_${zamimgClassName}.jpg`;
  }

  public static DEATH_KNIGHT = new WowClass(6, 1, 'Death Knight');
  public static DRUID = new WowClass(11, 2, 'Druid');
  public static HUNTER = new WowClass(3, 3, 'Hunter');
  public static MAGE = new WowClass(8, 4, 'Mage');
  public static MONK = new WowClass(10, 5, 'Monk');
  public static PALADIN = new WowClass(2, 6, 'Paladin');
  public static PRIEST = new WowClass(5, 7, 'Priest');
  public static ROGUE = new WowClass(4, 8, 'Rogue');
  public static SHAMAN = new WowClass(7, 9, 'Shaman');
  public static WARLOCK = new WowClass(9, 10, 'Warlock');
  public static WARRIOR = new WowClass(1, 11, 'Warrior');

  public static getClassBySlug(slug: string): WowClass | undefined {
    return WowClass.getAll().find((wowClass) => wowClass.slug === slug);
  }

  public static getClassByFileName(fileName: string): WowClass | undefined {
    if (fileName === 'DEATHKNIGHT') {
      return WowClass.DEATH_KNIGHT;
    }
    return this.getClassBySlug(fileName);
  }

  public static getClassByName(name: string): WowClass | undefined {
    if (!name) {
      throw new Error('invalid class name: ' + name);
    }
    const normalizedName: string = WowClass.normalizeName(name);
    switch (normalizedName) {
      case WowClass.DEATH_KNIGHT.slug:
        return WowClass.DEATH_KNIGHT;
      case WowClass.DRUID.slug:
        return WowClass.DRUID;
      case WowClass.HUNTER.slug:
        return WowClass.HUNTER;
      case WowClass.MAGE.slug:
        return WowClass.MAGE;
      case WowClass.MONK.slug:
        return WowClass.MONK;
      case WowClass.PALADIN.slug:
        return WowClass.PALADIN;
      case WowClass.PRIEST.slug:
        return WowClass.PRIEST;
      case WowClass.ROGUE.slug:
        return WowClass.ROGUE;
      case WowClass.SHAMAN.slug:
        return WowClass.SHAMAN;
      case WowClass.WARLOCK.slug:
        return WowClass.WARLOCK;
      case WowClass.WARRIOR.slug:
        return WowClass.WARRIOR;
    }
    return undefined;
  }

  public static getClassByWarcraftLogsId(classId: number): WowClass | undefined {
    if (classId > 11) {
      throw new Error('No class for id ' + classId);
    }
    switch (classId) {
      case 1:
        return WowClass.DEATH_KNIGHT;
      case 2:
        return WowClass.DRUID;
      case 3:
        return WowClass.HUNTER;
      case 4:
        return WowClass.MAGE;
      case 5:
        return WowClass.MONK;
      case 6:
        return WowClass.PALADIN;
      case 7:
        return WowClass.PRIEST;
      case 8:
        return WowClass.ROGUE;
      case 9:
        return WowClass.SHAMAN;
      case 10:
        return WowClass.WARLOCK;
      case 11:
        return WowClass.WARRIOR;
    }
    return undefined;
  }

  public static getClassById(classId: number): WowClass | undefined {
    if (classId > 11) {
      throw new Error('No class for id ' + classId);
    }
    switch (classId) {
      case 1:
        return this.WARRIOR;
      case 2:
        return this.PALADIN;
      case 3:
        return this.HUNTER;
      case 4:
        return this.ROGUE;
      case 5:
        return this.PRIEST;
      case 6:
        return this.DEATH_KNIGHT;
      case 7:
        return this.SHAMAN;
      case 8:
        return this.MAGE;
      case 9:
        return this.WARLOCK;
      case 10:
        return this.MONK;
      case 11:
        return this.DRUID;
    }
    return undefined;
  }

  public static getAll(): WowClass[] {
    return [
      WowClass.DEATH_KNIGHT,
      WowClass.DRUID,
      WowClass.HUNTER,
      WowClass.MAGE,
      WowClass.MONK,
      WowClass.PALADIN,
      WowClass.PRIEST,
      WowClass.ROGUE,
      WowClass.SHAMAN,
      WowClass.WARLOCK,
      WowClass.WARRIOR
    ];
  }

  private static normalizeName(name: string): string {
    return paramCase(name).toUpperCase();
  }
}
