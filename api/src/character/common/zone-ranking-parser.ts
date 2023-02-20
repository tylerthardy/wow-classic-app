import { ZoneEncounterRanking } from '../../warcraft-logs/common';

const FLAME_LEVIATHAN_ENCOUNTER_ID: number = 744;
const ALGALON_ENCOUNTER_ID: number = 757;

const FILTERED_ENCOUNTER_ID_LOOKUP: { [key: number]: boolean } = {
  [FLAME_LEVIATHAN_ENCOUNTER_ID]: true
};
const HARD_MODE_OVERRIDE_ENCOUNTER_ID_LOOKUP: { [key: number]: boolean } = {
  [ALGALON_ENCOUNTER_ID]: true
};

export class ZoneRankingParser {
  public static filterUnrankedEncounters(encounterRankings: ZoneEncounterRanking[]): ZoneEncounterRanking[] {
    const filteredEncounters = encounterRankings.filter(
      (encounterRanking) => !FILTERED_ENCOUNTER_ID_LOOKUP[encounterRanking.encounter.id]
    );
    return filteredEncounters;
  }

  public static getHardModes(encounterRankings: ZoneEncounterRanking[]): string[] {
    return encounterRankings
      .filter(
        (ranking) =>
          ranking.totalKills > 0 &&
          (ranking.bestAmount > 20000000 || HARD_MODE_OVERRIDE_ENCOUNTER_ID_LOOKUP[ranking.encounter.id])
      )
      .map((ranking) => ranking.encounter.name);
  }

  public static getHardModeCount(zoneId: number): number {
    if (zoneId === 1017) {
      // FIXME: Zone ids enum
      return 13 - 4; // 8 + Algalon
    }
    if (zoneId === 1015) {
      return 1; // Sartharion
    }
    return 0;
  }

  public static getBestProgress(encounterRankings: ZoneEncounterRanking[]): number {
    const killCount: number = encounterRankings.filter((ranking) => ranking.totalKills > 0).length;
    return killCount;
  }
}
