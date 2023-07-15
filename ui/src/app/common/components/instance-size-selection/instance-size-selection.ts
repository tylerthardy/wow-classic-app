import { Instance, Raid, RaidSize } from 'classic-companion-core';
import { SoftresRaidSlug } from '../../services/softres/softres-raid-slug';
import { IInstanceSizeSelection } from './instance-size-selection.interface';

export class InstanceSizeSelection implements IInstanceSizeSelection {
  public instance: Instance;
  public sizes: RaidSize[];

  constructor(data: IInstanceSizeSelection) {
    this.instance = data.instance;
    this.sizes = data.sizes;
  }

  public hasSize(): boolean {
    return this.sizes.length > 0;
  }

  // TODO: Evaluate if we REALLY need to getRaid... or if you can just use InstanceSizeSelection - maybe provide the data through selection
  public getRaid(): Raid {
    const raid: Raid = this.instance.getRaid(this.getSize());
    return raid;
  }

  public getSoftResSlug(): SoftresRaidSlug | undefined {
    // FIXME: Should use proper type
    return this.getRaid().softresSlug as SoftresRaidSlug;
  }

  public getSize(): RaidSize {
    if (this.sizes.length === 0) {
      throw new Error("Can't get size: No size selected");
    }
    if (this.sizes.length > 1) {
      throw new Error("Can't get size: More than 1 size selected");
    }
    return this.sizes[0];
  }

  public getSoftResSlugs(): SoftresRaidSlug[] {
    const raids: Raid[] = this.sizes.map((size) => this.instance.getRaid(size));
    // FIXME: Should use proper type
    return raids.map((raid) => raid.softresSlug as SoftresRaidSlug);
  }
}
