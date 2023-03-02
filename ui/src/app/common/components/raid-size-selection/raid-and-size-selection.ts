import { SoftresRaidSlug } from '../../services/softres/softres-raid-slug';
import { IRaidAndSizeSelection } from './raid-and-size-selection.interface';

export class RaidAndSizeSelection implements IRaidAndSizeSelection {
  public raid?: string;
  public size10?: boolean;
  public size25?: boolean;

  constructor(value: IRaidAndSizeSelection = {}) {
    this.raid = value.raid;
    this.size10 = value.size10;
    this.size25 = value.size25;
  }
  public hasRaidAndSize(): boolean {
    return !!this.raid && (this.size10 === true || this.size25 === true);
  }

  public getSoftResSlug(): SoftresRaidSlug | undefined {
    const slugs: SoftresRaidSlug[] = this.getSoftResSlugs();
    if (slugs.length === 0) {
      return undefined;
    }
    if (slugs.length > 1) {
      throw new Error("Can't get slug: More than 1 size selected");
    }
    return slugs[0];
  }

  public getSize(): number {
    if (!this.size10 && !this.size25) {
      throw new Error("Can't get size: No size selected");
    }
    if (this.size10 && this.size25) {
      throw new Error("Can't get size: More than 1 size selected");
    }
    return this.size10 ? 10 : 25;
  }

  public getSoftResSlugs(): SoftresRaidSlug[] {
    const results: SoftresRaidSlug[] = [];
    if (!this.hasRaidAndSize()) {
      return results;
    }
    if (this.raid === 'ulduar') {
      if (this.size10) {
        results.push('ulduar10');
      }
      if (this.size25) {
        results.push('ulduar25');
      }
    }
    if (this.raid === 'wotlknaxx') {
      if (this.size10) {
        results.push('wotlknaxx10p2');
      }
      if (this.size25) {
        results.push('wotlknaxx25');
      }
    }
    if (this.raid === 'obsidiansanctum') {
      if (this.size10) {
        results.push('obsidiansanctum10p2');
      }
      if (this.size25) {
        results.push('obsidiansanctum25');
      }
    }
    if (this.raid === 'eyeofeternity') {
      if (this.size10) {
        results.push('eyeofeternity10p2');
        if (this.size25) {
          results.push('eyeofeternity25');
        }
      }
    }
    return results;
  }

  public duplicate(): RaidAndSizeSelection {
    return new RaidAndSizeSelection({
      raid: this.raid,
      size10: this.size10,
      size25: this.size25
    });
  }
}
