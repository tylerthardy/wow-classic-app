import { Instance, Instances, Raid, RaidSize, Raids } from 'classic-companion-core';
import { INitImportLockout } from './nit-import-lockout.interface';

export class Lockout {
  public resetTime: number;
  public raid?: Raid;

  constructor(importData: INitImportLockout) {
    this.resetTime = importData.resetTime;
    this.raid = this.getRaid(importData.name, importData.difficultyName);
  }

  private getRaid(raidName: string, difficultyName: string): Raid | undefined {
    const instance: Instance | undefined = this.getInstance(raidName);
    const size: RaidSize | undefined = this.getSize(difficultyName);
    if (!size || !instance) {
      // If no size or instance, then this is a dungeon, so return undefined raid
      return undefined;
    }
    const raid: Raid | undefined = Raids.getRaidBySizeInstance(instance, size);
    if (!raid) {
      throw new Error('cannot find raid for nit import');
    }
    return raid;
  }

  private getInstance(raidName: string): Instance | undefined {
    const instance: Instance | undefined = Instances.getByName(raidName);
    if (!instance) {
      // If no instance, then this is a dungeon, so return undefined instance
      return undefined;
    }
    return instance;
  }

  private getSize(difficultyName: string): RaidSize | undefined {
    const parts: string[] = difficultyName.split(' ');
    if (parts.length === 0) {
      throw new Error('size has no parts');
    }
    if (parts.length === 1) {
      // If one part, it's likely "heroic" which means a dungeon, so return undefined raid size
      return undefined;
    }
    // Raid size will be the first part of the string i.e. "25 Player (Heroic)"
    const sizeString: string = parts[0];
    const parsedSize: number = Number.parseInt(sizeString);
    if (parsedSize !== 10 && parsedSize !== 25 && parsedSize !== 40) {
      throw new Error('unrecognized raid size ' + parsedSize);
    }
    return parsedSize;
  }
}
