import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IGetCharacterZoneRankingsRequest,
  IGetCharacterZoneRankingsResponse,
  IGetMultipleCharacterZoneRankingsRequest,
  IGetMultipleCharacterZoneRankingsResponse
} from 'classic-companion-core';
import { Observable, of } from 'rxjs';
import { AppConfig } from '../../../config/app.config';
import { RegionServerService } from '../region-server.service';
import { ToastService } from '../toast/toast.service';
import { IGetCharacterZoneRankings } from './get-character-zone-rankings.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(
    private config: AppConfig,
    private toastService: ToastService,
    private regionServerService: RegionServerService,
    private http: HttpClient
  ) {}

  public getZoneRankings(query: IGetCharacterZoneRankings): Observable<IGetCharacterZoneRankingsResponse> {
    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      this.toastService.warn('Invalid Server', 'Choose your server at top of page');
      return of();
    }
    const url: string = `${this.config.apiUrl}/character`;
    const request: IGetCharacterZoneRankingsRequest = {
      ...query,
      serverSlug: this.regionServerService.regionServer.serverSlug!,
      serverRegion: this.regionServerService.regionServer.regionSlug!
    };
    return this.http.post<IGetCharacterZoneRankingsResponse>(url, request);
  }

  public getMultipleZoneRankings(
    queries: IGetCharacterZoneRankings[]
  ): Observable<IGetMultipleCharacterZoneRankingsResponse> {
    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      this.toastService.warn('Invalid Server', 'Choose your server at top of page');
      return of();
    }
    const url: string = `${this.config.apiUrl}/character/multiple`;
    const requests: IGetCharacterZoneRankingsRequest[] = queries.map((query) => ({
      ...query,
      serverSlug: this.regionServerService.regionServer.serverSlug!,
      serverRegion: this.regionServerService.regionServer.regionSlug!
    }));
    const body: IGetMultipleCharacterZoneRankingsRequest = {
      characters: requests
    };
    return this.http.post<IGetMultipleCharacterZoneRankingsResponse>(url, body);
  }
}
