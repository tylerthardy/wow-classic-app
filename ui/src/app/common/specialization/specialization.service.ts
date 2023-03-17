import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetSpecializationBisResponse, Specialization } from 'classic-companion-core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

export interface Class {}

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  constructor(private config: AppConfig, private http: HttpClient) {}

  public getBis(specialization: Specialization): Observable<GetSpecializationBisResponse> {
    const wowClass = specialization.getClassKebab();
    const role = specialization.role.toLowerCase();
    const spec = specialization.getSpecKebab();
    const url: string = `${this.config.apiUrl}/specialization/${wowClass}/${spec}/${role}/bis`;
    return this.http.get<GetSpecializationBisResponse>(url);
  }
}
