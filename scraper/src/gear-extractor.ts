import {
  GEAR_PLANNER_SLOTS,
  IGearPlannerData,
  ISlotData,
  IWowSimsExport,
  IWowSimsExportItem,
  Specialization,
  SpecializationData,
  WOWSIMS_EXPORT_SLOT_NUMBER_BY_NAME
} from 'classic-companion-core';
import got from 'got';
import { WowheadParseFunction } from './wowhead-parse-function';

// Matches [gear-planner=someValue], and captures someValue
// Done by matching any character until the first closing bracket ]
const GEAR_PLANNER_REGEX = new RegExp(/\[gear-planner=([^\]]*)\]/g);
// Matches [tab name="someValue"], and captures someValue
// Done by matching any character until the first closing quotation "
const TAB_REGEX = new RegExp(/\[tab [^\]]*name=\\"([^"]*)\\"\]/g);

export class GearExtractor {
  public specialization: Specialization;

  constructor(specializationData: SpecializationData, private phaseNumber: number) {
    this.specialization = new Specialization(specializationData);
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
    const classSlug: string = this.specialization.getClassKebab();
    const specNameSlug: string = this.specialization.getSpecKebab();
    const roleSlug: string = this.specialization.role.toLowerCase();

    const url: string = `https://www.wowhead.com/wotlk/guide/classes/${classSlug}/${specNameSlug}/${roleSlug}-bis-gear-pve-phase-${this.phaseNumber}`;
    return url;
  }

  public convertGearPlannerSetsToWowSims(sets: { [key: string]: IGearPlannerData }): IWowSimsExport[] {
    return Object.keys(sets).map((setName) => this.transformGearPlannerToWowSimsExport(setName, sets[setName]));
  }

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
      // Not sure why this jsonify is necessary, but a reference is carrying over somewhere
      plannerSets.push(JSON.parse(JSON.stringify(parsedPlannerData)));
    }
    return plannerSets;
  }

  private transformGearPlannerToWowSimsExport(setName: string, gearPlannerData: IGearPlannerData): IWowSimsExport {
    const wowSimsExport: IWowSimsExport = {
      talents: gearPlannerData.talentHash,
      glyphs: {
        major: [],
        minor: []
      },
      class: '',
      race: '',
      name: setName,
      gear: {
        items: this.transformGearPlannerSlotsToWowSimsItems(gearPlannerData.slots)
      },
      professions: [],
      level: 80,
      spec: '',
      realm: ''
    };
    return wowSimsExport;
  }

  private transformGearPlannerSlotsToWowSimsItems(gearPlannerSlots: {
    [key: number]: ISlotData;
  }): IWowSimsExportItem[] {
    const items: IWowSimsExportItem[] = [];

    Object.entries(gearPlannerSlots).map(([slotKey, slotData]) => {
      // convert slot number from gearplanner to wowsims
      const gearPlannerSlotNumber: number = Number.parseInt(slotKey);
      const slotName: string = GEAR_PLANNER_SLOTS[gearPlannerSlotNumber];
      const wowSimsSlotNumber: number = WOWSIMS_EXPORT_SLOT_NUMBER_BY_NAME[slotName];

      // extract gems
      const gems: number[] = [];
      if (slotData.gems) {
        Object.entries(slotData.gems).map((kvp2) => {
          const gemSlot: number = Number.parseInt(kvp2[0]);
          gems[gemSlot] = kvp2[1];
        });
      }

      // export item
      const exportItem: IWowSimsExportItem = {
        id: slotData.item,
        gems: gems,
        enchant: slotData.enchant
      };
      items[wowSimsSlotNumber] = exportItem;
    });

    return items;
  }
}
