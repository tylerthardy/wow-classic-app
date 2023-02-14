import { DifficultyLevel } from '../../common/models/difficulty-level.type';
import { ZoneEncounterRanking } from '../../warcraft-logs/common';
import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';

export class GetCharacterZoneRankingsResponseV2Ranking implements IGetCharacterZoneRankingsResponseV2Ranking {
  public encounterName: string;
  public lockedIn: boolean;
  public bestPercent?: number;
  public bestSpec?: string;
  public medianPercent?: number;
  public highestAmount?: number;
  public kills?: number;
  public fastest?: number;
  public highestDifficulty?: string;

  constructor(encounterRanking: ZoneEncounterRanking) {
    const [highestAmount, difficulty] = this.parseDifficultyLevelAndAmount(encounterRanking.bestAmount);
    const adjustedFastest: number = this.subtractDifficultyTime(difficulty, encounterRanking.fastestKill);
    const bestPercent: number = Math.floor(encounterRanking.rankPercent);
    const medianPercent: number = Math.floor(encounterRanking.medianPercent);

    this.encounterName = encounterRanking.encounter.name;
    this.lockedIn = encounterRanking.lockedIn;
    if (encounterRanking.totalKills > 0) {
      this.bestPercent = bestPercent;
      this.bestSpec = encounterRanking.bestSpec;
      this.medianPercent = medianPercent;
      this.highestAmount = highestAmount;
      this.kills = encounterRanking.totalKills;
      this.fastest = adjustedFastest;

      this.highestDifficulty = this.getDifficultyName(difficulty, encounterRanking.encounter.id);
    }
  }

  private parseDifficultyLevelAndAmount(fullDps: number): [number, DifficultyLevel] {
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
