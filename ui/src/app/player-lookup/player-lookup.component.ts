import { Component, Input, OnInit } from '@angular/core';
import { CharacterService } from '../common/services/character.service';
import { CharacterZoneRankings } from '../common/services/graphql';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { PlayerLookupViewModel } from './player-lookup.viewmodel';

@Component({
  selector: 'app-player-lookup',
  templateUrl: './player-lookup.component.html',
  styleUrls: ['./player-lookup.component.scss']
})
export class PlayerLookupComponent implements OnInit {
  @Input() instanceSlug: SoftresRaidSlug = 'ulduar10';
  characterName: string = 'merterter';
  zoneRankingsLoading: boolean = false;
  viewModel: PlayerLookupViewModel | undefined;

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    public regionServerService: RegionServerService
  ) {}

  ngOnInit(): void {}

  public onPlayerNameKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchClick();
    }
  }

  public onSearchClick(): void {
    this.searchPlayer(this.characterName);
  }

  public onClearClick(): void {
    this.viewModel = undefined;
  }

  public searchPlayer(name: string) {
    this.characterName = name;

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
      .subscribe((result: CharacterZoneRankings) => {
        this.viewModel = new PlayerLookupViewModel(result);
        this.zoneRankingsLoading = false;
      });
  }
}
