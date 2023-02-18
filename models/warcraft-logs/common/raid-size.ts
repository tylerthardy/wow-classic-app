export const RaidSizeValues = [10, 25, 40] as const;
export type RaidSize = (typeof RaidSizeValues)[number];
