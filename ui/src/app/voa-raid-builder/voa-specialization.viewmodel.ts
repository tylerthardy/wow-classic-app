import { SpecializationData } from '../common/specialization/specialization-data.interface';
import { VoaSpec } from './voa-spec.interface';

export class VoaSpecializationViewModel {
  public selected: boolean = false;
  public specialization: SpecializationData;
  public voaSpec: VoaSpec;

  constructor(voaSpec: VoaSpec, spec: SpecializationData) {
    this.specialization = spec;
    this.voaSpec = voaSpec;
  }

  public toggle(): void {
    this.selected = !this.selected;
  }
}
