import { Component } from '@angular/core';
import { Specialization, WowClass } from 'classic-companion-core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { RankingMetric } from '../../common/services/graphql';
import { IMyCharacterImportModalInput } from './my-character-import-modal-input.interface';
import { IMyCharacterImportModalOutput } from './my-character-import-modal-output.interface';

@Component({
  selector: 'app-my-character-import-modal',
  templateUrl: './my-character-import-modal.component.html',
  styleUrls: ['./my-character-import-modal.component.scss']
})
export class MyCharacterImportModalComponent
  extends SimpleModalComponent<IMyCharacterImportModalInput, IMyCharacterImportModalOutput>
  implements IMyCharacterImportModalInput
{
  public name?: string;
  public metric?: RankingMetric;
  public wowClass?: WowClass;
  public specialization?: Specialization;

  public metricOptions: RankingMetric[] = ['dps', 'hps'];

  constructor() {
    super();
  }

  confirm() {
    const errors: string[] = this.getFormErrors();
    if (errors.length > 0) {
      alert(`Form data not valid: ${JSON.stringify(errors)}`);
      return;
    }

    this.result = {
      name: this.name!,
      metric: this.metric!,
      wowClass: this.wowClass!,
      specialization: this.specialization!
    };
    this.close();
  }

  public onClassChange(wowClass: WowClass | undefined): void {
    this.specialization = undefined;
  }

  private getFormErrors(): string[] {
    const errors: string[] = [];
    if (!this.name) {
      errors.push('Name is required');
    }
    if (!this.metric) {
      errors.push('Metric is required');
    }
    if (!this.wowClass) {
      errors.push('Class is required');
    }
    if (!this.specialization) {
      errors.push('Specialization is required');
    }
    return errors;
  }
}
