import { SpecializationData } from 'classic-companion-core';
import got from 'got';
import { IGearPlannerData } from './gear-planner-data.interface';
import { WowheadParseFunction } from './wowhead-parse-function';

// Matches [gear-planner=someValue], and captures someValue
// Done by matching any character until the first closing bracket ]
const GEAR_PLANNER_REGEX = new RegExp(/\[gear-planner=([^\]]*)\]/g);
// Matches [tab name="someValue"], and captures someValue
// Done by matching any character until the first closing quotation "
const TAB_REGEX = new RegExp(/\[tab [^\]]*name=\\"([^"]*)\\"\]/g);

export class GearExtractor {
  constructor(private specialization: SpecializationData, private phaseNumber: number) {}

  private getTabs(input: string): string[] {
    const tabs: string[] = [];
    let tabsTagResult;
    while ((tabsTagResult = TAB_REGEX.exec(input)) !== null) {
      tabs.push(tabsTagResult[1]);
    }
    return tabs;
  }

  private getPlanners(input: string): IGearPlannerData[] {
    const plannerSets: IGearPlannerData[] = [];
    let plannerTagResult;
    while ((plannerTagResult = GEAR_PLANNER_REGEX.exec(input)) !== null) {
      let gearPlannerData = plannerTagResult[1];
      gearPlannerData = gearPlannerData.replaceAll('\\', '');
      if (gearPlannerData.split('/').length < 3) {
        // skip invalid data
        continue;
      }
      const parsedPlannerData: IGearPlannerData = WowheadParseFunction.parse(gearPlannerData);
      plannerSets.push(parsedPlannerData);
    }
    return plannerSets;
  }

  public async extractGearDataFromPage(url: string): Promise<{ [key: string]: IGearPlannerData }> {
    const response = await got(url);
    const tabs = this.getTabs(response.body);
    const planners = this.getPlanners(response.body);
    if (tabs.length > 0 && tabs.length !== planners.length) {
      const message = 'tabs length does not match planners length';
      console.error(message, {
        tabs,
        planners
      });
      throw new Error(message);
    }

    const sets: { [key: string]: IGearPlannerData } = {};
    for (let i = 0; i < planners.length; i++) {
      let tab: string = tabs[i] ?? 'BiS';
      const planner: IGearPlannerData = planners[i];
      sets[tab] = planner;
    }
    return sets;
  }

  public getSpecGearUrl() {
    const classSlug: string = this.specialization.className.replace(' ', '-').toLowerCase();
    const specNameSlug: string = this.specialization.specializationName.replace(' ', '-').toLowerCase();
    const roleSlug: string = this.specialization.role.toLowerCase();

    const url: string = `https://www.wowhead.com/wotlk/guide/classes/${classSlug}/${specNameSlug}/${roleSlug}-bis-gear-pve-phase-${this.phaseNumber}`;
    return url;
  }
}
