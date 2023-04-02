import { IGetCharacterZoneRankingsResponseRanking } from 'classic-companion-core';
import { DifficultyLevel } from '../../common/models/difficulty-level.type';
import { ZoneEncounterRanking } from '../../warcraft-logs/common';

export class GetCharacterZoneRankingsResponseRanking implements IGetCharacterZoneRankingsResponseRanking {
  public encounterName: string;
  public encounterId: number;
  public lockedIn: boolean;
  public bestPercent?: number;
  public bestSpec?: string;
  public medianPercent?: number;
  public highestAmount?: number;
  public kills?: number;
  public fastest?: number;
  public highestDifficulty?: string;

  constructor(encounterRanking: ZoneEncounterRanking) {
    const difficulty: DifficultyLevel = this.getDifficulty(encounterRanking.bestAmount, encounterRanking.fastestKill);
    const adjustedHighest: number = this.subtractDifficultyDps(difficulty, encounterRanking.bestAmount);
    const adjustedFastest: number = this.subtractDifficultyTime(difficulty, encounterRanking.fastestKill);
    const bestPercent: number = Math.floor(encounterRanking.rankPercent);
    const medianPercent: number = Math.floor(encounterRanking.medianPercent);

    this.encounterName = encounterRanking.encounter.name;
    this.encounterId = encounterRanking.encounter.id;
    this.lockedIn = encounterRanking.lockedIn;
    if (encounterRanking.totalKills > 0) {
      this.bestPercent = bestPercent;
      this.bestSpec = encounterRanking.bestSpec;
      this.medianPercent = medianPercent;
      this.highestAmount = adjustedHighest;
      this.kills = encounterRanking.totalKills;
      this.fastest = adjustedFastest;

      this.highestDifficulty = this.getDifficultyName(difficulty, encounterRanking.encounter.id);
    }
  }

  private getDifficulty(fullDps: number, fullTime: number): DifficultyLevel {
    if (fullDps >= 80000000 || fullTime < -60000000) {
      return 4;
    } else if (fullDps >= 60000000 || fullTime < -40000000) {
      return 3;
    } else if (fullDps >= 40000000 || fullTime < -20000000) {
      return 2;
    } else if (fullDps >= 20000000 || fullTime < 0) {
      return 1;
    } else {
      return 0;
    }
  }

  private subtractDifficultyDps(difficulty: DifficultyLevel, dps: number): number {
    if (difficulty === 4 && dps >= 80000000) {
      return dps - 80000000;
    }
    if (difficulty === 3 && dps >= 60000000) {
      return dps - 60000000;
    }
    if (difficulty === 2 && dps >= 40000000) {
      return dps - 40000000;
    }
    if (difficulty === 1 && dps >= 20000000) {
      return dps - 20000000;
    }
    return dps;
  }

  private subtractDifficultyTime(difficulty: DifficultyLevel, time: number): number {
    if (difficulty === 4 && time < -60000000) {
      return time + 80000000;
    }
    if (difficulty === 3 && time < -40000000) {
      return time + 60000000;
    }
    if (difficulty === 2 && time < -20000000) {
      return time + 40000000;
    }
    if (difficulty === 1 && time < 0) {
      return time + 20000000;
    }
    return time;
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
}
