import { Injectable } from '@angular/core';
import { SpecializationData, specializations } from 'classic-companion-core';
import { GetSpecializationsOptions } from './get-specializations-options.interface';

export interface Class {}

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  constructor() {}

  getSpecializations(options: GetSpecializationsOptions): SpecializationData[] {
    let filteredSpecializations: SpecializationData[] = Object.assign([], specializations);
    if (options.omitWarcraftLogsSpecs) {
      filteredSpecializations = specializations.filter((spec) => !spec.isWarcraftLogsOnly);
    }
    return filteredSpecializations;
  }
}
