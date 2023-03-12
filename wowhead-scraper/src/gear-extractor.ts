import got from 'got';
import { SpecializationData } from './common/specializations';
import { IGearPlannerData } from './gear-planner-data.interface';
import { WowheadParseFunction } from './wowhead-parse-function';

const GEAR_PLANNER_REGEX = new RegExp(/\[gear-planner=([^\]]*)\]/);

// Matches [gear-planner=someValue], and captures someValue
export class GearExtractor {
  constructor(private specialization: SpecializationData, private phaseNumber: number) {}

  public async extractGearDataFromPage(url: string): Promise<IGearPlannerData> {
    const response = await got(url);
    const result = GEAR_PLANNER_REGEX.exec(response.body);
    if (!result) {
      throw new Error('gear planner not found');
    }
    let gearPlannerData = result[1];
    gearPlannerData = gearPlannerData.replaceAll('\\', '');
    const parsedPlannerData = WowheadParseFunction.parse(gearPlannerData);
    return parsedPlannerData;
  }

  public getSpecGearUrl() {
    const classSlug: string = this.specialization.className.replace(' ', '-').toLowerCase();
    const specNameSlug: string = this.specialization.specializationName.replace(' ', '-').toLowerCase();
    const roleSlug: string = this.specialization.role.toLowerCase();

    const url: string = `https://www.wowhead.com/wotlk/guide/classes/${classSlug}/${specNameSlug}/${roleSlug}-bis-gear-pve-phase-${this.phaseNumber}`;
    return url;
  }
}
