import { Instance, Instances, Raid, RaidSize, Raids } from 'classic-companion-core';

// TODO: Remove interfaces?
export interface INitImport {
  version: string;
  lockouts: { [characterName: string]: INitImportLockout[] }; // TODO: Rename characters
}

export class NitImport implements INitImport {
  public version: string;
  public lockouts: { [characterName: string]: NitImportLockout[] };

  constructor(data: INitImport) {
    this.version = data.version;
    const lockouts: { [characterName: string]: NitImportLockout[] } = {};
    // TODO: Holy shit this is excessive
    Object.entries(data.lockouts).map((kvp) => {
      const characterName: string = kvp[0];
      const lockoutDatas: INitImportLockout[] = kvp[1];
      lockouts[characterName] = [];
      lockoutDatas.forEach((lockoutDatum) => {
        lockouts[characterName].push(new NitImportLockout(lockoutDatum));
      });
    });
    this.lockouts = lockouts;
  }
}

export interface INitImportLockout {
  locked: boolean; // true;
  resetTime: number; // 1692716402;
  name: string; // "Trial of the Crusader";
  difficultyName: string; // "10 Player (Heroic)"
}

export class NitImportLockout implements INitImportLockout {
  public locked: boolean;
  public resetTime: number;
  public name: string; // TODO: Rename instanceName
  public difficultyName: string;

  constructor(data: INitImportLockout) {
    this.locked = data.locked;
    this.resetTime = data.resetTime;
    this.name = data.name;
    this.difficultyName = data.difficultyName;
  }

  public getRaid(): Raid | undefined {
    const instance: Instance | undefined = this.getInstance();
    const size: RaidSize | undefined = this.getSize();
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

  private getInstance(): Instance | undefined {
    const instance: Instance | undefined = Instances.getByName(this.name);
    if (!instance) {
      // If no instance, then this is a dungeon, so return undefined instance
      return undefined;
    }
    return instance;
  }

  private getSize(): RaidSize | undefined {
    const parts: string[] = this.difficultyName.split(' ');
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
