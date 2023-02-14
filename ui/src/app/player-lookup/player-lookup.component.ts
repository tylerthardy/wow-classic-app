import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { CharacterService } from '../common/services/character/character.service';
import { IGetCharacterZoneRankingsResponse } from '../common/services/character/get-character-zone-rankings-response.interface';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ToastService } from '../common/services/toast.service';
import { PlayerLookupViewModel } from './player-lookup.viewmodel';

@Component({
  selector: 'app-player-lookup',
  templateUrl: './player-lookup.component.html',
  styleUrls: ['./player-lookup.component.scss']
})
export class PlayerLookupComponent implements OnInit {
  @Input() instanceSlug: SoftresRaidSlug = 'ulduar10';
  characterName: string | undefined;
  zoneRankingsLoading: boolean = false;
  viewModel: PlayerLookupViewModel | undefined;

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    private toastService: ToastService,
    public regionServerService: RegionServerService
  ) {}

  ngOnInit(): void {}

  public onPlayerNameKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchClick();
    }
  }

  public onSearchClick(): void {
    if (!this.characterName) {
      alert('a character name must be specified'); // FIXME: Use toast, among other bullshit
      return;
    }
    this.searchPlayer(this.characterName);
  }

  public onClearClick(): void {
    this.viewModel = undefined;
  }

  public searchPlayer(name: string) {
    this.characterName = name;
    this.viewModel = undefined;

    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      alert('choose your server at top of page'); // FIXME: Use toast, among other bullshit
      return;
    }

    const raidZoneAndSize: RaidZoneAndSize = this.raidService.getZoneAndSize(this.instanceSlug);
    this.zoneRankingsLoading = true;

    this.characterService
      .getZoneRankings({
        characterName: this.characterName,
        metric: 'dps',
        serverRegion: this.regionServerService.regionServer.regionSlug,
        serverSlug: this.regionServerService.regionServer.serverSlug,
        zoneId: raidZoneAndSize.zoneId,
        size: raidZoneAndSize.size
      })
      .pipe(finalize(() => (this.zoneRankingsLoading = false)))
      .subscribe({
        next: (result: IGetCharacterZoneRankingsResponse) => (this.viewModel = new PlayerLookupViewModel(result)),
        error: (error) => {
          if (error.status === 400) {
            this.toastService.warn('Invalid Request', error.error.message);
            return;
          }
          if (error.status === 404) {
            this.toastService.warn('Character Not Found', `${this.characterName} was not found on WarcraftLogs`);
            return;
          }
          throw error;
        }
      });
  }
}
