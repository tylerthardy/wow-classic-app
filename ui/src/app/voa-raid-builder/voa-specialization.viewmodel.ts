import { ISpecializationData } from 'classic-companion-core';
import { IVoaSpec } from './voa-spec.interface';

export class VoaSpecializationViewModel {
  public selected: boolean = false;
  public specialization: ISpecializationData;
  public voaSpec: IVoaSpec;

  constructor(voaSpec: IVoaSpec, spec: ISpecializationData) {
    this.specialization = spec;
    this.voaSpec = voaSpec;
  }

  public toggle(): void {
    this.selected = !this.selected;
  }
}
