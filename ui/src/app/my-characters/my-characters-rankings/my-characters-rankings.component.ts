import { Component, Input, OnInit } from '@angular/core';
import { IGetCharacterZoneRankingsResponse, Instances, Raid } from 'classic-companion-core';
import { Observable, finalize, forkJoin } from 'rxjs';
import { InstanceSizeSelection } from '../../common/components/instance-size-selection/instance-size-selection';
import { CharacterService } from '../../common/services/character/character.service';
import { IGetCharacterZoneRankings } from '../../common/services/character/get-character-zone-rankings.interface';
import { ThemeService } from '../../common/services/theme/theme.service';
import { ToastService } from '../../common/services/toast/toast.service';
import { Character } from '../character';
import { MyCharactersRankingsViewModel } from './my-characters-rankings.viewmodel';

@Component({
  selector: 'app-my-characters-rankings',
  templateUrl: './my-characters-rankings.component.html',
  styleUrls: ['./my-characters-rankings.component.scss']
})
export class MyCharactersRankingsComponent implements OnInit {
  @Input() myCharacters!: Character[];
  @Input() public instanceSizeSelection: InstanceSizeSelection = new InstanceSizeSelection({
    instance: Instances.MOST_RECENT_RAID,
    sizes: [25]
  });
  public viewModel: MyCharactersRankingsViewModel | undefined;
  public isLoading: boolean = false;

  constructor(
    private characterService: CharacterService,
    private themeService: ThemeService,
    private toastService: ToastService
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
    let raid: Raid;
    try {
      raid = this.instanceSizeSelection.getRaid();
    } catch (err) {
      this.toastService.error('Error', 'No raids found for provided data' + JSON.stringify(this.instanceSizeSelection));
      return;
    }
    const characterObservables: Observable<IGetCharacterZoneRankingsResponse>[] = this.myCharacters.map((character) => {
      const request: IGetCharacterZoneRankings = {
        characterName: character.name,
        zoneId: raid.instance.zoneId,
        metric: character.metric,
        size: raid.size
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
