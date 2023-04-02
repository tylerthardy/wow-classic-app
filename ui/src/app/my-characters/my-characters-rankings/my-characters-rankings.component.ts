import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IGetCharacterZoneRankingsResponse } from 'classic-companion-core';
import { finalize, forkJoin, Observable } from 'rxjs';
import { RaidAndSizeSelection } from '../../common/components/raid-size-selection/raid-and-size-selection';
import { CharacterService } from '../../common/services/character/character.service';
import { IGetCharacterZoneRankings } from '../../common/services/character/get-character-zone-rankings.interface';
import { RaidService } from '../../common/services/raids/raid.service';
import { SoftresRaidSlug } from '../../common/services/softres/softres-raid-slug';
import { ThemeService } from '../../common/services/theme/theme.service';
import { Character } from '../character';
import { MyCharactersRankingsViewModel } from './my-characters-rankings.viewmodel';

@Component({
  selector: 'app-my-characters-rankings',
  templateUrl: './my-characters-rankings.component.html',
  styleUrls: ['./my-characters-rankings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyCharactersRankingsComponent implements OnInit {
  @Input() myCharacters!: Character[];
  public viewModel: MyCharactersRankingsViewModel | undefined;
  public raidAndSize: RaidAndSizeSelection = new RaidAndSizeSelection({
    raid: 'ulduar',
    size10: true
  });
  public isLoading: boolean = false;

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    if (!this.myCharacters) {
      throw new Error('myCharacters needs to be defined');
    }
  }

  public onSearchClick(): void {
    this.getMyCharacterRankings();
  }

  private getMyCharacterRankings(): void {
    const characterObservables: Observable<IGetCharacterZoneRankingsResponse>[] = this.myCharacters.map((character) => {
      const slug: SoftresRaidSlug | undefined = this.raidAndSize.getSoftResSlug();
      if (!slug) {
        throw new Error(
          'no slug for raid ' + this.raidAndSize.raid + this.raidAndSize.size10 + this.raidAndSize.size25
        );
      }
      const zoneAndSize = this.raidService.getZoneAndSize(slug);
      const request: IGetCharacterZoneRankings = {
        characterName: character.name,
        zoneId: zoneAndSize.zoneId,
        metric: character.metric,
        size: this.raidAndSize.getSize()
      };
      return this.characterService.getZoneRankings(request);
    });

    this.isLoading = true;
    forkJoin(characterObservables)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((characterResponses) => {
        this.viewModel = new MyCharactersRankingsViewModel(characterResponses, this.themeService.theme);
      });
  }
}
