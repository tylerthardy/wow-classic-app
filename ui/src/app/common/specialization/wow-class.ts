export type Specializations = { [specName: string]: Specialization };
export interface Specialization {
  iconUrl: string;
  role: WowRole;
}

export type WowRole = 'DPS' | 'Tank' | 'Healer';

export class WowClass {
  public id: number;
  public warcraftLogsId: number;
  public name: string;

  constructor(id: number, warcraftLogsId: number, name: string) {
    this.id = id;
    this.warcraftLogsId = warcraftLogsId;
    this.name = name;
  }

  public getSlugifiedName(): string {
    const slugified: string = this.name.toLowerCase().replace(' ', '');
    return slugified;
  }

  public getClassIconUrl(): string {
    return `https://wow.zamimg.com/images/wow/icons/large/classicon_${this.getSlugifiedName()}.jpg`;
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

  public static getClassByName(name: string): WowClass | undefined {
    if (!name) {
      throw new Error('invalid class name');
    }
    switch (name) {
      case WowClass.DEATH_KNIGHT.name:
        return WowClass.DEATH_KNIGHT;
      case WowClass.DRUID.name:
        return WowClass.DRUID;
      case WowClass.HUNTER.name:
        return WowClass.HUNTER;
      case WowClass.MAGE.name:
        return WowClass.MAGE;
      case WowClass.MONK.name:
        return WowClass.MONK;
      case WowClass.PALADIN.name:
        return WowClass.PALADIN;
      case WowClass.PRIEST.name:
        return WowClass.PRIEST;
      case WowClass.ROGUE.name:
        return WowClass.ROGUE;
      case WowClass.SHAMAN.name:
        return WowClass.SHAMAN;
      case WowClass.WARLOCK.name:
        return WowClass.WARLOCK;
      case WowClass.WARRIOR.name:
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
}
