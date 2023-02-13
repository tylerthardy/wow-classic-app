import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../app.config';
import { CharacterZoneRankings, ZoneRankingsQuery } from '../graphql';
import { IGetMultipleCharacterZoneRankingsResponse } from './get-multiple-character-zone-rankings-response';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private config: AppConfig, private http: HttpClient) {}

  public getZoneRankings(query: ZoneRankingsQuery): Observable<CharacterZoneRankings> {
    const url: string = `${this.config.apiUrl}/character`;
    return this.http.post<CharacterZoneRankings>(url, query);
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
