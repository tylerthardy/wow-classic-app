import { CharacterRank } from '../common/services/graphql';
import { PlayerDeath } from '../common/services/PlayerDeath';

export class CharacterRankTableRow {
  public date: Date;
  public rankPercent: number;
  public guildName: string;
  public averageItemLevel: number;
  public playerDeaths: PlayerDeath[] = [];
  public playerDeathsLoading: boolean = false;
  public logUrl: string;

  constructor(rank: CharacterRank) {
    this.rankPercent = rank.rankPercent;
    this.guildName = rank.guild?.name ?? 'None';
    this.averageItemLevel = rank.bracketData;
    this.date = new Date(rank.report.startTime);
    this.logUrl = 'https://classic.warcraftlogs.com/reports/' + rank.report.code;
  }
}
