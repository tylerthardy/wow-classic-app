import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IMyCharactersLockoutsSave,
  IMyCharactersLockoutsSaveCharacter,
  IPostMyCharacter,
  IPostMyCharacters
} from 'classic-companion-core';
import { Observable, map, of } from 'rxjs';
import { RegionServerService } from '../common/services/region-server.service';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class MyCharactersService {
  constructor(private config: AppConfig, private regionServerService: RegionServerService, private http: HttpClient) {}

  public getAll(): Observable<IMyCharactersLockoutsSave> {
    const url: string = `${this.config.apiUrl}/my-characters`;
    return this.http.get<IMyCharactersLockoutsSaveCharacter[]>(url).pipe(
      map((result: IMyCharactersLockoutsSaveCharacter[]) => {
        const output: IMyCharactersLockoutsSave = {
          version: '',
          showHidden: false,
          characters: result
        };
        return output;
      })
    );
  }

  public save(data: any): Observable<void> {
    if (!this.regionServerService.validate()) {
      return of();
    }
    // FIXME: Cleanup types
    const transformed: IPostMyCharacters = data as IPostMyCharacters;
    const region: string = this.regionServerService.regionServer.regionSlug!;
    const server: string = this.regionServerService.regionServer.serverSlug!;

    transformed.characters.forEach((character) => {
      character.regionSlug = region;
      character.serverSlug = server;
    });

    return this.http.post<void>(`${this.config.apiUrl}/my-characters`, data);
  }

  public saveCharacter(data: IMyCharactersLockoutsSaveCharacter): Observable<void> {
    if (!this.regionServerService.validate()) {
      return of();
    }
    // FIXME: Cleanup types
    const transformed: IPostMyCharacter = data as unknown as IPostMyCharacter;
    const region: string = this.regionServerService.regionServer.regionSlug!;
    const server: string = this.regionServerService.regionServer.serverSlug!;

    transformed.regionSlug = region;
    transformed.serverSlug = server;

    return this.http.post<void>(`${this.config.apiUrl}/my-characters/character`, data);
  }
}
