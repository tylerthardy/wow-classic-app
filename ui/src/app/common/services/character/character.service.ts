import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { AppConfig } from '../../../config/app.config';
import { ZoneRankingsQuery } from '../graphql';
import { IGetCharacterZoneRankingsResponse } from './get-character-zone-rankings-response.interface';
import { IGetMultipleCharacterZoneRankingsResponse } from './get-multiple-character-zone-rankings-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private config: AppConfig, private authService: AuthService, private http: HttpClient) {}

  public getZoneRankings(query: ZoneRankingsQuery): Observable<IGetCharacterZoneRankingsResponse> {
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
