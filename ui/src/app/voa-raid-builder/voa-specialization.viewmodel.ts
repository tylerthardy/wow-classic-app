import { SpecializationData } from 'classic-companion-core';
import { IVoaSpec } from './voa-spec.interface';

export class VoaSpecializationViewModel {
  public selected: boolean = false;
  public specialization: SpecializationData;
  public voaSpec: IVoaSpec;

  constructor(voaSpec: IVoaSpec, spec: SpecializationData) {
    this.specialization = spec;
    this.voaSpec = voaSpec;
  }

  public toggle(): void {
    this.selected = !this.selected;
  }
}
