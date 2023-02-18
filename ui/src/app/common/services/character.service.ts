import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IGetCharacterZoneRankingsRequest,
  IGetCharacterZoneRankingsResponse,
  IGetMultipleCharacterZoneRankingsResponse
} from '../../../../../models/api';
import { AppConfig } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private config: AppConfig, private http: HttpClient) {}

  public getZoneRankings(query: IGetCharacterZoneRankingsRequest): Observable<IGetCharacterZoneRankingsResponse> {
    const url: string = `${this.config.apiUrl}/character`;
    return this.http.post<IGetCharacterZoneRankingsResponse>(url, query);
  }

  public getMultipleZoneRankings(
    queries: IGetCharacterZoneRankingsRequest[]
  ): Observable<IGetMultipleCharacterZoneRankingsResponse> {
    const url: string = `${this.config.apiUrl}/character/multiple`;
    // FIXME: Use imported interface type
    const body = {
      characters: queries
    };
    return this.http.post<IGetMultipleCharacterZoneRankingsResponse>(url, body);
  }
}
