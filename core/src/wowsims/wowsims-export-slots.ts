export enum WOWSIMS_EXPORT_SLOTS {
  HEAD,
  NECK,
  SHOULDERS,
  BACK,
  CHEST,
  WRIST,
  HANDS,
  WAIST,
  LEGS,
  FEET,
  FINGER1,
  FINGER2,
  TRINKET1,
  TRINKET2,
  MAINHAND,
  OFFHAND,
  RANGED
}

const slotNumberByName: { [name: string]: number } = {};
const enumKeys: string[] = Object.keys(WOWSIMS_EXPORT_SLOTS);
for (let i = 0; i < enumKeys.length; i++) {
  const slotName: string = enumKeys[i];
  slotNumberByName[slotName] = WOWSIMS_EXPORT_SLOTS[slotName];
}
export const WOWSIMS_EXPORT_SLOT_NUMBER_BY_NAME: { [name: string]: WOWSIMS_EXPORT_SLOTS } = slotNumberByName;
