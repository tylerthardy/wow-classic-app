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
  public static VaultOfArchavon = new Instance({
    name: 'Vault of Archavon',
    zoneId: 1016,
    sizes: [10, 25],
    holdOverSlug: 'voa',
    hardModeCount: 0
  });
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
  public static Onyxia = new Instance({
    name: "Onyxia's Lair",
    zoneId: 1019,
    sizes: [10, 25],
    holdOverSlug: 'wotlkonyxia',
    hardModeCount: 0
  });
  public static ToGC = new Instance({
    name: 'Trial of the Crusader',
    zoneId: 1018,
    sizes: [10, 25],
    holdOverSlug: 'toc',
    hardModeCount: 5
  });
  public static IcecrownCitadel = new Instance({
    name: 'Icecrown Citadel',
    zoneId: 1020,
    sizes: [10, 25],
    holdOverSlug: 'icc',
    hardModeCount: 12
  });

  public static MOST_RECENT_RAID: Instance = Instances.IcecrownCitadel;
  public static All: Instance[] = [
    Instances.VaultOfArchavon,
    Instances.Naxxramas,
    Instances.ObsidianSanctum,
    Instances.EyeOfEternity,
    Instances.Onyxia,
    Instances.Ulduar,
    Instances.ToGC,
    Instances.IcecrownCitadel
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
  slug: string;
  instance: Instance;
  size: RaidSize;
  softresSlug: string;
  lfgName: string;
}
export class Raid implements IRaid {
  public slug: string;
  public instance: Instance;
  public size: RaidSize;
  public softresSlug: string;
  public lfgName: string;

  constructor(data: IRaid) {
    this.slug = data.slug;
    this.instance = data.instance;
    this.size = data.size;
    this.softresSlug = data.softresSlug;
    this.lfgName = data.lfgName;
  }
}
export class Raids {
  public static Naxx10 = new Raid({
    slug: 'Naxx10',
    instance: Instances.Naxxramas,
    size: 10,
    softresSlug: 'wotlknaxx10p2',
    lfgName: 'Naxx 10'
  });
  public static Naxx25 = new Raid({
    slug: 'Naxx25',
    instance: Instances.Naxxramas,
    size: 25,
    softresSlug: 'wotlknaxx25',
    lfgName: 'Naxx 25'
  });
  public static VoA10 = new Raid({
    slug: 'VoA10',
    instance: Instances.VaultOfArchavon,
    size: 10,
    softresSlug: 'has_no_softres',
    lfgName: 'VoA 10'
  });
  public static VoA25 = new Raid({
    slug: 'VoA25',
    instance: Instances.VaultOfArchavon,
    size: 25,
    softresSlug: 'has_no_softres',
    lfgName: 'VoA 25'
  });
  public static OS10 = new Raid({
    slug: 'OS10',
    instance: Instances.ObsidianSanctum,
    size: 10,
    softresSlug: 'obsidiansanctum10p2',
    lfgName: 'OS 10'
  });
  public static OS25 = new Raid({
    slug: 'OS25',
    instance: Instances.ObsidianSanctum,
    size: 25,
    softresSlug: 'obsidiansanctum25',
    lfgName: 'OS 25'
  });
  public static EoE10 = new Raid({
    slug: 'EoE10',
    instance: Instances.EyeOfEternity,
    size: 10,
    softresSlug: 'eyeofeternity10p2',
    lfgName: 'EoE 10'
  });
  public static EoE25 = new Raid({
    slug: 'EoE25',
    instance: Instances.EyeOfEternity,
    size: 25,
    softresSlug: 'eyeofeternity25',
    lfgName: 'EoE 25'
  });
  public static Ulduar10 = new Raid({
    slug: 'Ulduar10',
    instance: Instances.Ulduar,
    size: 10,
    softresSlug: 'ulduar10p2',
    lfgName: 'Uld 10'
  });
  public static Ulduar25 = new Raid({
    slug: 'Ulduar25',
    instance: Instances.Ulduar,
    size: 25,
    softresSlug: 'ulduar25',
    lfgName: 'Uld 10'
  });
  public static Onyxia10 = new Raid({
    slug: 'Onyxia10',
    instance: Instances.Onyxia,
    size: 10,
    softresSlug: 'wotlkonyxia10',
    lfgName: 'Ony 10'
  });
  public static Onyxia25 = new Raid({
    slug: 'Onyxia25',
    instance: Instances.Onyxia,
    size: 25,
    softresSlug: 'wotlkonyxia25',
    lfgName: 'Ony 25'
  });
  public static ToGC10 = new Raid({
    slug: 'ToGC10',
    instance: Instances.ToGC,
    size: 10,
    softresSlug: 'toc10',
    lfgName: 'ToGC 10'
  });
  public static ToGC25 = new Raid({
    slug: 'ToGC25',
    instance: Instances.ToGC,
    size: 25,
    softresSlug: 'toc25',
    lfgName: 'ToGC 25'
  });
  public static ICC10 = new Raid({
    slug: 'ICC10',
    instance: Instances.IcecrownCitadel,
    size: 10,
    softresSlug: 'icc10',
    lfgName: 'ICC 10'
  });
  public static ICC25 = new Raid({
    slug: 'ICC25',
    instance: Instances.IcecrownCitadel,
    size: 25,
    softresSlug: 'icc25',
    lfgName: 'ICC 25'
  });

  public static All = [
    Raids.VoA10,
    Raids.VoA25,
    Raids.Naxx10,
    Raids.Naxx25,
    Raids.OS10,
    Raids.OS25,
    Raids.EoE10,
    Raids.EoE25,
    Raids.Ulduar10,
    Raids.Ulduar25,
    Raids.Onyxia10,
    Raids.Onyxia25,
    Raids.ToGC10,
    Raids.ToGC25,
    Raids.ICC10,
    Raids.ICC25
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
