import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IGetCharacterZoneRankingsRequest,
  IGetCharacterZoneRankingsResponse,
  IGetMultipleCharacterZoneRankingsResponse
} from 'classic-companion-core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../config/app.config';
import { ZoneRankingsQuery } from '../graphql';
import { RegionServerService } from '../region-server.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private config: AppConfig, private regionServerService: RegionServerService, private http: HttpClient) {}

  public getZoneRankings(query: IGetCharacterZoneRankingsRequest): Observable<IGetCharacterZoneRankingsResponse> {
    const url: string = `${this.config.apiUrl}/character`;
    const request: IGetCharacterZoneRankingsRequest = {
      ...query,
      serverSlug: this.regionServerService.regionServer.serverSlug!,
      serverRegion: this.regionServerService.regionServer.regionSlug!
    };
    return this.http.post<IGetCharacterZoneRankingsResponse>(url, request);
  }

  public getZoneRankingsV1(query: ZoneRankingsQuery): Observable<IGetCharacterZoneRankingsResponse> {
    const url: string = `${this.config.apiUrl}/character`;
    return this.http.post<IGetCharacterZoneRankingsResponse>(url, query);
  }

  public getMultipleZoneRankings(queries: ZoneRankingsQuery[]): Observable<IGetMultipleCharacterZoneRankingsResponse> {
    const url: string = `${this.config.apiUrl}/character/multiple`;
    // FIXME: Use imported interface type
    const body = {
      characters: queries
    };
    return this.http.post<IGetMultipleCharacterZoneRankingsResponse>(url, body);
  }
}
