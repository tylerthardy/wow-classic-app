import { DeathKnight, Druid, Hunter, Mage, Monk, Paladin, Priest, Rogue, Shaman, Warlock, Warrior } from './classes';
import { WowClass } from './wow-class';

export class WowClasses {
  public static DEATH_KNIGHT = new DeathKnight();
  public static DRUID = new Druid();
  public static HUNTER = new Hunter();
  public static MAGE = new Mage();
  public static MONK = new Monk();
  public static PALADIN = new Paladin();
  public static PRIEST = new Priest();
  public static ROGUE = new Rogue();
  public static SHAMAN = new Shaman();
  public static WARLOCK = new Warlock();
  public static WARRIOR = new Warrior();

  public static getClassBySlug(slug: string): WowClass {
    const wowClass: WowClass | undefined = WowClasses.getAll().find((wowClass) => wowClass.slug === slug);
    if (!wowClass) {
      throw new Error('Cannot find wowclass by slug ' + slug);
    }
    return wowClass;
  }

  public static getClassByFileName(fileName: string): WowClass | undefined {
    if (fileName === 'DEATHKNIGHT') {
      return WowClasses.DEATH_KNIGHT;
    }
    return this.getClassBySlug(fileName);
  }

  public static getClassByName(name: string): WowClass | undefined {
    if (!name) {
      throw new Error('invalid class name: ' + name);
    }
    const normalizedName: string = WowClasses.normalizeName(name);
    switch (normalizedName) {
      case WowClasses.DEATH_KNIGHT.slug:
        return WowClasses.DEATH_KNIGHT;
      case WowClasses.DRUID.slug:
        return WowClasses.DRUID;
      case WowClasses.HUNTER.slug:
        return WowClasses.HUNTER;
      case WowClasses.MAGE.slug:
        return WowClasses.MAGE;
      case WowClasses.MONK.slug:
        return WowClasses.MONK;
      case WowClasses.PALADIN.slug:
        return WowClasses.PALADIN;
      case WowClasses.PRIEST.slug:
        return WowClasses.PRIEST;
      case WowClasses.ROGUE.slug:
        return WowClasses.ROGUE;
      case WowClasses.SHAMAN.slug:
        return WowClasses.SHAMAN;
      case WowClasses.WARLOCK.slug:
        return WowClasses.WARLOCK;
      case WowClasses.WARRIOR.slug:
        return WowClasses.WARRIOR;
    }
    return undefined;
  }

  public static getClassByWarcraftLogsId(classId: number): WowClass | undefined {
    if (classId > 11) {
      throw new Error('No class for id ' + classId);
    }
    switch (classId) {
      case 1:
        return WowClasses.DEATH_KNIGHT;
      case 2:
        return WowClasses.DRUID;
      case 3:
        return WowClasses.HUNTER;
      case 4:
        return WowClasses.MAGE;
      case 5:
        return WowClasses.MONK;
      case 6:
        return WowClasses.PALADIN;
      case 7:
        return WowClasses.PRIEST;
      case 8:
        return WowClasses.ROGUE;
      case 9:
        return WowClasses.SHAMAN;
      case 10:
        return WowClasses.WARLOCK;
      case 11:
        return WowClasses.WARRIOR;
    }
    return undefined;
  }

  public static getClassById(classId: number): WowClass | undefined {
    if (classId > 11) {
      throw new Error('No class for id ' + classId);
    }
    switch (classId) {
      case 1:
        return WowClasses.WARRIOR;
      case 2:
        return WowClasses.PALADIN;
      case 3:
        return WowClasses.HUNTER;
      case 4:
        return WowClasses.ROGUE;
      case 5:
        return WowClasses.PRIEST;
      case 6:
        return WowClasses.DEATH_KNIGHT;
      case 7:
        return WowClasses.SHAMAN;
      case 8:
        return WowClasses.MAGE;
      case 9:
        return WowClasses.WARLOCK;
      case 10:
        return WowClasses.MONK;
      case 11:
        return WowClasses.DRUID;
    }
    return undefined;
  }

  public static getAll(): WowClass[] {
    return [
      WowClasses.DEATH_KNIGHT,
      WowClasses.DRUID,
      WowClasses.HUNTER,
      WowClasses.MAGE,
      WowClasses.MONK,
      WowClasses.PALADIN,
      WowClasses.PRIEST,
      WowClasses.ROGUE,
      WowClasses.SHAMAN,
      WowClasses.WARLOCK,
      WowClasses.WARRIOR
    ];
  }

  // TODO: De-dupe
  private static normalizeName(name: string): string {
    return name.toUpperCase().replace(' ', '');
  }
}
