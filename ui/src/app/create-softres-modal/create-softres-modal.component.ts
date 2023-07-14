import { Component, Input } from '@angular/core';
import { Instances } from 'classic-companion-core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { InstanceSizeSelection } from '../common/components/instance-size-selection/instance-size-selection';
import { ItemData } from '../common/item-data.interface';
import { CreateSoftresModalData } from './create-softres-modal-data.interface';

@Component({
  selector: 'app-create-softres-modal',
  templateUrl: 'create-softres-modal.component.html',
  styleUrls: ['./create-softres-modal.component.scss']
})
export class CreateSoftresModalComponent
  extends SimpleModalComponent<CreateSoftresModalData, CreateSoftresModalData>
  implements CreateSoftresModalData
{
  @Input() instanceSizeSelection: InstanceSizeSelection = new InstanceSizeSelection({
    instance: Instances.ToGC,
    sizes: [25]
  });
  hardReserveItem: ItemData | undefined = undefined;
  hardReserveRecipient: string | undefined = undefined;
  softReserveCount: number = 1;

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
      instanceSizeSelection: this.instanceSizeSelection,
      hardReserveItem: this.hardReserveItem,
      hardReserveRecipient: this.hardReserveRecipient,
      softReserveCount: this.softReserveCount
    };
    this.close();
  }

  private getFormErrors(): string[] {
    const errors: string[] = [];
    if (!this.instanceSizeSelection.hasSize()) {
      errors.push('A size must be selected');
    }
    if (this.hardReserveItem && !this.hardReserveRecipient) {
      errors.push('A recipient must be specified for the hard-reserved item');
    }
    if (!this.hardReserveItem && this.hardReserveRecipient) {
      errors.push('A hard-reserved item must be specified for the recipient');
    }
    return errors;
  }
}
