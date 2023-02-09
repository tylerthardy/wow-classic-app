import { Injectable } from '@angular/core';
import { GetSpecializationsOptions } from './get-specializations-options.interface';
import { SpecializationData } from './specialization-data.interface';
import { specializations } from './specializations';

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
