import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IMyCharactersLockoutsSave,
  IMyCharactersLockoutsSaveCharacter,
  IPostMyCharacters
} from 'classic-companion-core';
import { Observable, map, mergeMap } from 'rxjs';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class MyCharactersService {
  private config = {
    apiUrl: 'http://localhost:3000'
  };
  constructor(private http: HttpClient, private cognitoService: CognitoService) {}

  public getAll(): Observable<IMyCharactersLockoutsSave> {
    const url: string = `${this.config.apiUrl}/my-characters`;
    return this.tokenizedGet<IMyCharactersLockoutsSaveCharacter[]>(url).pipe(
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
    const transformed: IPostMyCharacters = data as IPostMyCharacters;
    const region: string = 'us';
    const server: string = 'benediction';

    transformed.characters.forEach((character) => {
      character.regionSlug = region;
      character.serverSlug = server;
    });

    return this.tokenizedPost<void>(`${this.config.apiUrl}/my-characters`, data);
  }

  private tokenizedGet<T>(url: string, options: any = {}): Observable<T> {
    if (!this.cognitoService.authenticated$.value) {
      throw new Error('Not authenticated');
    }
    const getOptions: {
      headers: HttpHeaders;
    } = {
      headers: new HttpHeaders(),
      ...options
    };
    const tokenedRequest: Observable<T> = this.cognitoService.getAccessToken().pipe(
      mergeMap((token: string | undefined) => {
        getOptions.headers = getOptions.headers.set('Authorization', `Bearer ${token}`);
        debugger;
        console.log(token);
        return this.http.get<T>(url, getOptions);
      })
    );
    return tokenedRequest;
  }

  private tokenizedPost<T>(url: string, body: any, options: any = {}): Observable<T> {
    if (!this.cognitoService.authenticated$.value) {
      throw new Error('Not authenticated');
    }
    const postOptions: {
      headers: HttpHeaders;
    } = {
      headers: new HttpHeaders(),
      ...options
    };
    const tokenedRequest: Observable<T> = this.cognitoService.getAccessToken().pipe(
      mergeMap((token: string | undefined) => {
        postOptions.headers = postOptions.headers.set('Authorization', `Bearer ${token}`);
        console.log(token);
        return this.http.post<T>(url, body, postOptions);
      })
    );
    return tokenedRequest;
  }
}
