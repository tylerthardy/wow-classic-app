import { Report, ReportDeathEvent, ReportFight, ReportPlayerDetails } from '../common/services/graphql';
import { ReportPlayerDeath } from '../guild-logs-summary/ReportPlayerDeath';

export interface GuildReportDeathEvent extends ReportDeathEvent {
  fightDetails: ReportFight;
  player: ReportPlayerDetails;
}

export class GuildReport implements Report {
  readonly code: string;
  readonly startTime: number;
  readonly endTime: number;
  readonly playerDetails: {
    readonly data: {
      readonly playerDetails: {
        readonly healers: ReportPlayerDetails[];
        readonly dps: ReportPlayerDetails[];
        readonly tanks: ReportPlayerDetails[];
      };
    };
  };
  readonly events: { readonly data: ReportDeathEvent[] };
  readonly fights: ReportFight[];

  public deathEvents: GuildReportDeathEvent[];
  public deathsByPlayerName: Map<string, GuildReportDeathEvent[]>;
  public players: ReportPlayerDetails[];
  private fightsById: { [key: number]: ReportFight };
  private playersById: { [key: number]: ReportPlayerDetails };

  constructor(report: Report) {
    this.code = report.code;
    this.startTime = report.startTime;
    this.endTime = report.endTime;
    this.playerDetails = report.playerDetails;
    this.events = report.events;
    this.fights = report.fights;

    this.fightsById = this.getFightsById();
    this.players = this.getUniquePlayers();
    this.playersById = this.getPlayersById();
    this.deathEvents = this.getDeathEvents();
    this.deathsByPlayerName = this.getDeathsByPlayerName();
  }

  public getReportPlayerDeaths(): ReportPlayerDeath[] {
    const result: ReportPlayerDeath[] = [];

    this.deathsByPlayerName.forEach((deathEvents: GuildReportDeathEvent[]) => {
      deathEvents.forEach((deathEvent: GuildReportDeathEvent) => {
        result.push({
          report: this,
          death: deathEvent,
          player: deathEvent.player
        });
      });
    });

    return result;
  }

  private getFightsById(): { [key: number]: ReportFight } {
    const fightsById: { [key: number]: ReportFight } = {};
    this.fights.forEach((fight: ReportFight) => (fightsById[fight.id] = fight));
    return fightsById;
  }

  private getPlayersById(): { [key: number]: ReportPlayerDetails } {
    const playersById: { [key: number]: ReportPlayerDetails } = {};
    this.players.forEach((player: ReportPlayerDetails) => (playersById[player.id] = player));
    return playersById;
  }

  private getUniquePlayers(): ReportPlayerDetails[] {
    // We populate playersById from the healers/tanks/dps object, while realistically we should grab
    // the list of actors from reportmasterdata to determine ids.
    // However this includes any players encountered while logging (large list)
    // https://www.warcraftlogs.com/v2-api-docs/warcraft/reportmasterdata.doc.html
    const allPlayers: ReportPlayerDetails[] = [
      ...(this.playerDetails.data.playerDetails.tanks ?? []),
      ...(this.playerDetails.data.playerDetails.healers ?? []),
      ...(this.playerDetails.data.playerDetails.dps ?? [])
    ];
    return [...new Map(allPlayers.map((item) => [item.guid, item])).values()];
  }

  private getDeathEvents(): GuildReportDeathEvent[] {
    return this.events.data.map((event: ReportDeathEvent) => {
      const newEvent: GuildReportDeathEvent = {
        ...event,
        fightDetails: this.fightsById[event.fight],
        player: this.playersById[event.targetID]
      };
      return newEvent;
    });
  }

  private getDeathsByPlayerName(): Map<string, GuildReportDeathEvent[]> {
    const deathEventsByPlayerName: Map<string, GuildReportDeathEvent[]> = new Map();
    this.deathEvents.forEach((deathEvent: GuildReportDeathEvent) => {
      if (!deathEvent.player) {
        // Skip if there's no player object, because we failed to match in the playersById lookup.
        // This can happen when a player does not perform any actions to classify them as healer/tanks/dps.
        return;
      }
      const playerName: string = deathEvent.player.name;
      const playerDeaths: GuildReportDeathEvent[] | undefined = deathEventsByPlayerName.get(playerName);
      if (playerDeaths) {
        playerDeaths.push(deathEvent);
      } else {
        deathEventsByPlayerName.set(playerName, [deathEvent]);
      }
    });
    return deathEventsByPlayerName;
  }
}
