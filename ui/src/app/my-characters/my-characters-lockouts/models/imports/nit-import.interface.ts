import { Instance, Instances, Raid, RaidSize, Raids } from 'classic-companion-core';

// TODO: Remove interfaces?
export interface INitImport {
  version: string;
  characters: {
    [characterName: string]: INitImportCharacter;
  };
}

export interface INitImportCharacter {
  instances: INitImportLockout[];
  classEnglish: string;
}
export class NitImportCharacter implements INitImportCharacter {
  public instances: NitImportLockout[];
  public classEnglish: string;

  constructor(data: INitImportCharacter) {
    this.classEnglish = data.classEnglish;
    const instances: NitImportLockout[] = [];
    data.instances.forEach((lockoutDatum) => {
      instances.push(new NitImportLockout(lockoutDatum));
    });
    this.instances = instances;
  }
}

export class NitImport implements INitImport {
  public version: string;
  public characters: { [characterName: string]: NitImportCharacter };

  constructor(data: INitImport) {
    this.version = data.version;
    const characters: { [characterName: string]: NitImportCharacter } = {};
    Object.entries(data.characters).map((kvp) => {
      const characterName: string = kvp[0];
      const characterData: NitImportCharacter = new NitImportCharacter(kvp[1]);
      characters[characterName] = characterData;
    });
    this.characters = characters;
  }
}

export interface INitImportLockout {
  locked: boolean; // true;
  resetTime: number; // 1692716402;
  instanceName: string; // "Trial of the Crusader";
  difficultyName: string; // "10 Player (Heroic)"
}

export class NitImportLockout implements INitImportLockout {
  public locked: boolean;
  public resetTime: number;
  public instanceName: string;
  public difficultyName: string;

  constructor(data: INitImportLockout) {
    this.locked = data.locked;
    this.resetTime = data.resetTime;
    this.instanceName = data.instanceName;
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
    const instance: Instance | undefined = Instances.getByName(this.instanceName);
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
