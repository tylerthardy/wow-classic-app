import { RaidSize } from '../common';

export interface IInstance {
  name: string;
  zoneId: number;
  sizes: number[];
  holdOverSlug: string; // TODO: Fix
  hardModeCount: number;
}
export class Instance implements IInstance {
  public name: string;
  public zoneId: number;
  public sizes: number[];
  public holdOverSlug: string; // TODO: enum work, remove this
  public hardModeCount: number;

  constructor(data: IInstance) {
    this.name = data.name;
    this.zoneId = data.zoneId;
    this.sizes = data.sizes;
    this.holdOverSlug = data.holdOverSlug;
    this.hardModeCount = data.hardModeCount;
  }

  // FIXME: Standardize using getter methods vs property getters
  public getRaid(size: RaidSize): Raid {
    const raid: Raid | undefined = Raids.getRaidBySizeInstance(this, size);
    if (!raid) {
      throw new Error(`no raid found: ${this.name}, ${size}`);
    }
    return raid;
  }

  public getImage(): string {
    return `https://assets.rpglogs.com/img/warcraft/zones/zone-${this.zoneId}-header-background.jpg`;
  }
}
export class Instances {
  public static Naxxramas = new Instance({
    name: 'Naxxramas',
    zoneId: 1015,
    sizes: [10, 25],
    holdOverSlug: 'wotlknaxx',
    hardModeCount: 0
  });
  public static ObsidianSanctum = new Instance({
    name: 'Obsidian Sanctum',
    zoneId: 1015,
    sizes: [10, 25],
    holdOverSlug: 'obsidiansanctum',
    hardModeCount: 1 // Sartharion
  });
  public static EyeOfEternity = new Instance({
    name: 'Eye of Eternity',
    zoneId: 1015,
    sizes: [10, 25],
    holdOverSlug: 'eyeofeternity',
    hardModeCount: 0
  });
  public static Ulduar = new Instance({
    name: 'Ulduar',
    zoneId: 1017,
    sizes: [10, 25],
    holdOverSlug: 'ulduar',
    hardModeCount: 13 - 4 // 8 + Algalon
  });
  public static ToGC = new Instance({
    name: 'Trial of the Crusader',
    zoneId: 1018,
    sizes: [10, 25],
    holdOverSlug: 'toc',
    hardModeCount: 5
  });

  public static All: Instance[] = [
    Instances.Naxxramas,
    Instances.ObsidianSanctum,
    Instances.EyeOfEternity,
    Instances.Ulduar,
    Instances.ToGC
  ];
  private static instanceByZoneId: Map<number, Instance> = new Map(
    Instances.All.map((instance) => [instance.zoneId, instance])
  );
  private static instanceByName: Map<string, Instance> = new Map(
    Instances.All.map((instance) => [instance.name, instance])
  );

  public static getByHoldOverSlug(slug: string): Instance {
    const instance: Instance | undefined = Instances.All.find((i) => i.holdOverSlug === slug);
    if (!instance) {
      throw new Error('instance not found for slug: ' + slug);
    }
    return instance;
  }

  public static getByZoneId(zoneId: number): Instance | undefined {
    return Instances.instanceByZoneId.get(zoneId);
  }

  public static getByName(name: string): Instance | undefined {
    return Instances.instanceByName.get(name);
  }
}

export interface IRaid {
  instance: Instance;
  size: RaidSize;
  softresSlug: string;
  lfgName: string;
}
export class Raid implements IRaid {
  public instance: Instance;
  public size: RaidSize;
  public softresSlug: string;
  public lfgName: string;

  constructor(data: IRaid) {
    this.instance = data.instance;
    this.size = data.size;
    this.softresSlug = data.softresSlug;
    this.lfgName = data.lfgName;
  }
}
export class Raids {
  public static Naxx10 = new Raid({
    instance: Instances.Naxxramas,
    size: 10,
    softresSlug: 'wotlknaxx10p2',
    lfgName: 'Naxx 10'
  });
  public static Naxx25 = new Raid({
    instance: Instances.Naxxramas,
    size: 25,
    softresSlug: 'wotlknaxx25',
    lfgName: 'Naxx 25'
  });
  public static OS10 = new Raid({
    instance: Instances.ObsidianSanctum,
    size: 10,
    softresSlug: 'obsidiansanctum10p2',
    lfgName: 'OS 10'
  });
  public static OS25 = new Raid({
    instance: Instances.ObsidianSanctum,
    size: 25,
    softresSlug: 'obsidiansanctum25',
    lfgName: 'OS 25'
  });
  public static EoE10 = new Raid({
    instance: Instances.EyeOfEternity,
    size: 10,
    softresSlug: 'eyeofeternity10p2',
    lfgName: 'EoE 10'
  });
  public static EoE25 = new Raid({
    instance: Instances.EyeOfEternity,
    size: 25,
    softresSlug: 'eyeofeternity25',
    lfgName: 'EoE 25'
  });
  public static Ulduar10 = new Raid({
    instance: Instances.Ulduar,
    size: 10,
    softresSlug: 'ulduar10p2',
    lfgName: 'Uld 10'
  });
  public static Ulduar25 = new Raid({
    instance: Instances.Ulduar,
    size: 25,
    softresSlug: 'ulduar25',
    lfgName: 'Uld 10'
  });
  public static ToGC10 = new Raid({
    instance: Instances.ToGC,
    size: 10,
    softresSlug: 'toc10',
    lfgName: 'ToGC 10'
  });
  public static ToGC25 = new Raid({
    instance: Instances.ToGC,
    size: 25,
    softresSlug: 'toc25',
    lfgName: 'ToGC 25'
  });

  private static All = [
    Raids.Naxx10,
    Raids.Naxx25,
    Raids.OS10,
    Raids.OS25,
    Raids.EoE10,
    Raids.EoE25,
    Raids.Ulduar10,
    Raids.Ulduar25,
    Raids.ToGC10,
    Raids.ToGC25
  ];
  private static raidBySoftRes: Map<string, Raid> = new Map(Raids.All.map((raid) => [raid.softresSlug, raid]));
  private static raidBySizeInstance: Map<RaidSize, Map<Instance, Raid>> = new Map([
    [10, new Map(Raids.All.filter((r) => r.size === 10).map((r) => [r.instance, r]))],
    [25, new Map(Raids.All.filter((r) => r.size === 25).map((r) => [r.instance, r]))]
  ]);

  public static getRaidBySizeInstance(instance: Instance, size: RaidSize): Raid | undefined {
    return this.raidBySizeInstance.get(size)?.get(instance);
  }
  public static getBySoftresSlug(softresSlug: string): Raid | undefined {
    return Raids.raidBySoftRes.get(softresSlug);
  }
}
