import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql, TypedDocumentNode } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
  CharacterData,
  CharacterEncounterRankings,
  EncounterRankingsQuery,
  EventDataType,
  Report,
  ReportData,
  ReportDeathEvent,
  ReportPlayerDetails
} from './graphql';
import { PlayerDeath } from './PlayerDeath';

@Injectable({
  providedIn: 'root'
})
export class WarcraftLogsService {
  constructor(private apollo: Apollo) {}

  public getReport(reportCode: string): Observable<Report> {
    const GET_FIGHTS: TypedDocumentNode<ReportData, unknown> = gql`
      query {
        reportData {
          report(code: "${reportCode}") {
            code
            startTime
            endTime
            fights {
              id
              encounterID
              startTime
              endTime
            }
          }
        }
      }
    `;

    return this.apollo
      .query({ query: GET_FIGHTS })
      .pipe(map((result: ApolloQueryResult<ReportData>) => result.data.reportData.report));
  }

  public getReportEncounterDeaths(report: Report, eventType: EventDataType): Observable<PlayerDeath[]> {
    const fightIds: number[] = report.fights.filter((fight) => fight.encounterID > 0).map((fight) => fight.id);
    const fightIdsCollection: string = `[${fightIds.join(',')}]`;
    const GET_ENCOUNTER_EVENTS: TypedDocumentNode<ReportData, unknown> = gql`
          query {
            reportData {
              report(code: "${report.code}") {
                playerDetails(fightIDs: ${fightIdsCollection})
                events(fightIDs: ${fightIdsCollection},  killType: Encounters, dataType: ${eventType}) {
                  data
                }
              }
            }
          }
        `;
    return this.apollo.query({ query: GET_ENCOUNTER_EVENTS }).pipe(
      map((playersReport) => {
        return this.mapDeathEventToPlayer(playersReport.data.reportData.report);
      })
    );
  }

  private mapDeathEventToPlayer(report: Report): PlayerDeath[] {
    const allPlayers: ReportPlayerDetails[] = [
      ...report.playerDetails.data.playerDetails.dps,
      ...report.playerDetails.data.playerDetails.healers,
      ...report.playerDetails.data.playerDetails.tanks
    ];
    const playerById: { [playerId: number]: ReportPlayerDetails } = {};
    allPlayers.forEach((player: ReportPlayerDetails) => (playerById[player.id] = player));
    const playerDeaths: PlayerDeath[] = report.events.data.map((event: ReportDeathEvent) => {
      const player: ReportPlayerDetails = playerById[event.targetID];
      const playerDeath: PlayerDeath = {
        ...event,
        playerDetails: player
      };
      return playerDeath;
    });

    return playerDeaths;
  }

  public getCharacterEncounterRankings(query: EncounterRankingsQuery): Observable<CharacterEncounterRankings> {
    const GET_CHARACTER_ENCOUNTER_RANKINGS: TypedDocumentNode<CharacterData, unknown> = gql`
      query {
        characterData {
          character(
            name: "${query.characterName}"
            serverSlug: "${query.serverSlug}"
            serverRegion: "${query.serverRegion}"
          ) {
            id
            name
            classID
            server {
              name
              slug
            }
            encounterRankings(encounterID: ${query.encounterId}, metric: ${query.metric})
          }
        }
      }
    `;

    return this.apollo
      .query({
        query: GET_CHARACTER_ENCOUNTER_RANKINGS
      })
      .pipe(
        map(
          (result: ApolloQueryResult<CharacterData>) =>
            result.data.characterData.character as CharacterEncounterRankings
        )
      );
  }
}
