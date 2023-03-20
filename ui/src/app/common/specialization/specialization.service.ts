import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetSpecializationBisResponse, Specialization } from 'classic-companion-core';
import { Observable, of, tap } from 'rxjs';
import { AppConfig } from '../../app.config';

export interface Class {}

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  private cachedSets: { [specKebab: string]: GetSpecializationBisResponse } = {};

  constructor(private config: AppConfig, private http: HttpClient) {}

  public getBis(specialization: Specialization): Observable<GetSpecializationBisResponse> {
    const spec = specialization.getSpecKebab();
    if (this.cachedSets[spec]) {
      return of(this.cachedSets[spec]);
    }
    const wowClass = specialization.getClassKebab();
    const role = specialization.role.toLowerCase();
    const url: string = `${this.config.apiUrl}/specialization/${wowClass}/${spec}/${role}/bis`;
    return this.http.get<GetSpecializationBisResponse>(url).pipe(
      tap((response) => {
        this.cachedSets[spec] = response;
      })
    );
  }
}
