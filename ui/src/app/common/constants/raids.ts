// import { SoftresRaidSlug } from '../services/softres/softres-raid-slug';

// export class RaidInstances {
//   Naxxramas: RaidInstance = {
//     name: 'Naxxramas',
//     warcraftLogsZoneId: 1015,
//     sizes: [10, 25],
//     softResSlugs: {
//       10: 'wotlknaxx10p2',
//       25: 'wotlknaxx25'
//     },
//     encounterIdMin: 1107,
//     encounterIdMax: 1121
//   };
//   ObsidianSanctum: RaidInstance = {
//     name: 'Obsidian Sanctum',
//     warcraftLogsZoneId: 1015,
//     sizes: [10, 25],
//     softResSlugs: {
//       10: 'obsidiansanctum10p2',
//       25: 'obsidiansanctum25'
//     },
//     encounterIdMin: 736,
//     encounterIdMax: 742,
//     hardModeEncounters: [742]
//   };
//   EyeOfEternity: RaidInstance = {
//     name: 'Eye of Eternity',
//     warcraftLogsZoneId: 1015,
//     sizes: [10, 25],
//     softResSlugs: {
//       10: 'eyeofeternity10p2',
//       25: 'eyeofeternity25'
//     },
//     encounterIdMin: 734,
//     encounterIdMax: 734
//   };
//   Ulduar: RaidInstance = {
//     name: 'Ulduar',
//     warcraftLogsZoneId: 1017,
//     sizes: [10, 25],
//     softResSlugs: {
//       10: 'ulduar10',
//       25: 'ulduar25'
//     },
//     encounterIdMin: 746,
//     encounterIdMax: 757,
//     hardModeEncounters: []
//   };
// }

// export interface RaidInstance {
//   name: string;
//   warcraftLogsZoneId: WarcraftLogZoneId;
//   sizes: RaidInstanceSize[];
//   softResSlugs: { [sizeKey in RaidInstanceSize]: SoftresRaidSlug };
//   encounterIdMin: number;
//   encounterIdMax: number;
//   hardModeEncounters?: number[]; // Should this be an encounter enum?
// }

// export type RaidInstanceSize = 10 | 25;
// export type WarcraftLogZoneId = 1015 | 1017;
