import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs';
import { CharacterEncounterRankings, EncounterRankingsQuery, Report } from '../common/services/graphql';
import { PlayerDeath } from '../common/services/PlayerDeath';
import { WarcraftLogsService } from '../common/services/warcraft-logs.service';
import { Encounter, ZoneEncounters } from '../common/services/ZoneEncounters';
import { CharacterRankTableRow } from './CharacterRankTableRow';

@Component({
  selector: 'player-rankings',
  templateUrl: './player-rankings.component.html',
  styleUrls: ['./player-rankings.component.scss']
})
export class PlayerRankingsComponent implements OnInit {
  characterName: string = 'perterter';
  encounterId: number = 101114;
  rankRows: CharacterRankTableRow[] = [];

  zoneEncounters: {
    [zoneName: string]: Encounter[];
  } = ZoneEncounters;

  constructor(private warcraftLogs: WarcraftLogsService) {}

  ngOnInit() {
    this.warcraftLogs
      .getCharacterEncounterRankings({
        characterName: 'perterter',
        serverSlug: 'benediction',
        serverRegion: 'us',
        encounterId: 101114,
        metric: 'dps'
      })
      .subscribe((result: CharacterEncounterRankings) => this.populateCharacter(result));
  }

  onSearch(): void {
    const query: EncounterRankingsQuery = {
      characterName: this.characterName,
      serverSlug: 'benediction',
      serverRegion: 'us',
      encounterId: this.encounterId,
      metric: 'dps'
    };
    this.warcraftLogs
      .getCharacterEncounterRankings(query)
      .subscribe((result: CharacterEncounterRankings) => this.populateCharacter(result));
  }

  jsonify(obj: any): string {
    return JSON.stringify(obj);
  }

  private populateCharacter(character: CharacterEncounterRankings): void {
    this.rankRows = character.encounterRankings.ranks.map((rank) => {
      const rankTableRow = new CharacterRankTableRow(rank);

      rankTableRow.playerDeathsLoading = true;
      this.warcraftLogs
        .getReport(rank.report.code)
        .pipe(mergeMap((report: Report) => this.warcraftLogs.getReportEncounterDeaths(report, 'Deaths')))
        .subscribe((deaths: PlayerDeath[]) => {
          const playerDeaths: PlayerDeath[] = deaths.filter(
            (death) =>
              death.playerDetails.name.toLowerCase() === character.name.toLowerCase() &&
              death.playerDetails.server.toLowerCase() === character.server.name.toLowerCase()
          );
          rankTableRow.playerDeathsLoading = false;
          rankTableRow.playerDeaths = playerDeaths;
          rankTableRow.date = new Date(rank.report.startTime);
        });
      return rankTableRow;
    });
  }
}
