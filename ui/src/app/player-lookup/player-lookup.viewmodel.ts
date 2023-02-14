import { ColumnSpecification, ParseColumnDeprecated } from '../common/components/grid/grid.component';
import { CharacterZoneRankings, ZoneEncounterRanking } from '../common/services/graphql';
import { SpecializationData } from '../common/specialization/specialization-data.interface';
import { specializations } from '../common/specialization/specializations';
import { WowClass } from '../common/specialization/wow-class';
import { ParseUtil } from '../common/utils';

export interface PlayerLookupViewModelRanking {
  encounterName: string;
  bestPercent: ParseColumnDeprecated;
  medianPercent: ParseColumnDeprecated;
  highestDps: number;
  highestDifficulty: string;
  kills: number;
  fastest: number;
  rowStyle?: { [key: string]: any };
}

export type DifficultyLevel = 0 | 1 | 2 | 3 | 4;

export class PlayerLookupViewModel {
  public characterName: string;
  public wowClass: WowClass;
  public bestPerformanceAverage: number;
  public medianPerformanceAverage: number;

  public data: PlayerLookupViewModelRanking[];
  public columns: ColumnSpecification<PlayerLookupViewModelRanking>[] = [
    {
      label: 'Boss',
      valueKey: 'encounterName',
      sortType: 'string'
    },
    {
      label: 'Best %',
      valueKey: 'bestPercent',
      sortType: 'parse',
      format: {
        type: 'parse'
      },
      style: (rowValue) => {
        return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercent.value) };
      }
    },
    {
      label: 'Med',
      valueKey: 'medianPercent',
      sortType: 'parse',
      format: {
        type: 'parse'
      },
      style: (rowValue) => {
        return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPercent.value) };
      }
    },
    {
      label: 'Highest DPS',
      valueKey: 'highestDps',
      sortType: 'number',
      format: {
        type: 'number',
        formatParams: '1.1-1'
      }
    },
    {
      label: 'Difficulty',
      valueKey: 'highestDifficulty',
      sortType: 'string'
    },
    {
      label: 'Kills',
      valueKey: 'kills',
      sortType: 'number',
      format: { type: 'number' }
    },
    {
      label: 'Fastest',
      valueKey: 'fastest',
      sortType: 'number',
      format: {
        type: 'date',
        formatParams: 'm:ss'
      }
    }
  ];

  constructor(data: CharacterZoneRankings) {
    // Overall ranking data
    this.characterName = data.name;
    this.bestPerformanceAverage = data.zoneRankings.bestPerformanceAverage;
    this.medianPerformanceAverage = data.zoneRankings.medianPerformanceAverage;

    // Class
    const wowClass: WowClass | undefined = WowClass.getClassByWarcraftLogsId(data.classID);
    if (!wowClass) {
      throw new Error('class cannot be found for id ' + data.classID);
    }
    this.wowClass = wowClass;

    // Encounter rankings data
    const FLAME_LEVIATHAN_ENCOUNTER_ID: number = 744;
    const encounterRankings: ZoneEncounterRanking[] = data.zoneRankings.rankings.filter(
      (encounterRanking) => encounterRanking.encounter.id !== FLAME_LEVIATHAN_ENCOUNTER_ID
    );

    this.data = encounterRankings.map((encounterRanking) => {
      const [highestDps, difficulty] = this.parseDifficultyLevelAndDps(encounterRanking.bestAmount);
      const adjustedFastest: number = this.subtractDifficultyTime(difficulty, encounterRanking.fastestKill);
      const bestPercent: number = Math.floor(encounterRanking.rankPercent);
      const medianPercent: number = Math.floor(encounterRanking.medianPercent);

      const viewModel: PlayerLookupViewModelRanking = {
        encounterName: encounterRanking.encounter.name + (!encounterRanking.lockedIn ? ' 🚀' : ''),
        bestPercent: {
          value: bestPercent,
          specialization: this.getSpecialization(encounterRanking.bestSpec)
        },
        medianPercent: {
          value: medianPercent
        },
        highestDps: highestDps,
        highestDifficulty: this.getDifficultyName(difficulty, encounterRanking.encounter.id),
        kills: encounterRanking.totalKills,
        fastest: adjustedFastest,
        rowStyle: !encounterRanking.lockedIn
          ? {
              'font-weight': 'bold',
              color: '#004000',
              'background-color': '#dcf4d9'
            }
          : {}
      };
      return viewModel;
    });
  }

  // FIXME: This should be some enum shit
  private getDifficultyName(difficulty: DifficultyLevel, encounterId: number): string {
    // Yogg
    if (encounterId === 756) {
      switch (difficulty) {
        case 4:
          return '0 Lights';
        case 3:
          return '1 Light';
        case 2:
          return '2 Lights';
        case 1:
          return '3 Lights';
        case 0:
          return '4 Lights';
      }
    }
    // Assembly of Iron
    if (encounterId === 748) {
      switch (difficulty) {
        case 4:
          return 'Steelbreaker';
        case 3:
        case 2:
          return 'Runemaster'; // 40m
        case 1:
        case 0:
          return 'Stormcaller';
      }
    }
    // Freya
    if (encounterId === 753) {
      switch (difficulty) {
        case 4:
          return '3 Elders';
        case 3:
          return '2 Elders';
        case 2:
          return '1 Elder';
        case 1:
        case 0:
          return '0 Elders';
      }
    }
    // Sartharion
    if (encounterId === 742) {
      switch (difficulty) {
        case 4:
        case 3:
          return '3 Drakes';
        case 2:
          return '2 Drakes';
        case 1:
          return '1 Drake';
        case 0:
          return '0 Drakes';
      }
    }
    if (
      encounterId === 747 ||
      encounterId === 751 ||
      encounterId === 752 ||
      encounterId === 754 ||
      encounterId === 755
    ) {
      switch (difficulty) {
        case 4:
        case 3:
        case 2:
        case 1:
          return 'Hard Mode';
        case 0:
          return 'Normal Mode';
      }
    }
    return '';
  }

  private parseDifficultyLevelAndDps(fullDps: number): [number, DifficultyLevel] {
    let dps: number = fullDps;
    let difficulty: DifficultyLevel = 0;
    if (fullDps >= 80000000) {
      dps = fullDps - 80000000;
      difficulty = 4;
    } else if (fullDps >= 60000000) {
      dps = fullDps - 60000000;
      difficulty = 3;
    } else if (fullDps >= 40000000) {
      dps = fullDps - 40000000;
      difficulty = 2;
    } else if (fullDps >= 20000000) {
      dps = fullDps - 20000000;
      difficulty = 1;
    }

    return [dps, difficulty];
  }

  private subtractDifficultyTime(difficulty: DifficultyLevel, time: number) {
    if (difficulty === 4) {
      return 80000000 + time;
    }
    if (difficulty === 3) {
      return 60000000 + time;
    }
    if (difficulty === 2) {
      return 40000000 + time;
    }
    if (difficulty === 1) {
      return 20000000 + time;
    }
    return time;
  }

  private getSpecialization(specName: string): SpecializationData | undefined {
    if (!specName || !this.wowClass) {
      return undefined;
    }

    const specialization: SpecializationData | undefined = specializations.find(
      (spec) => spec.className === this.wowClass.name && spec.specializationName === specName
    );
    if (!specialization) {
      throw new Error(`specialization ${specName} not found for class id ${this.wowClass.id}`);
    }

    return specialization;
  }
}
