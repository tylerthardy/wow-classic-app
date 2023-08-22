import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { IEditLockoutModalInput } from './edit-lockout-modal-input.interface';
import { IEditLockoutModalOutput } from './edit-lockout-modal-output.interface';

@Component({
  selector: 'app-edit-lockout-modal',
  templateUrl: './edit-lockout-modal.component.html',
  styleUrls: ['./edit-lockout-modal.component.scss']
})
export class EditLockoutModalComponent
  extends SimpleModalComponent<IEditLockoutModalInput, IEditLockoutModalOutput>
  implements IEditLockoutModalInput
{
  scheduledDay?: string;
  scheduledTime?: string;
  notes?: string;
  needsToRun!: boolean;
  completed!: boolean;

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
      scheduledDay: this.scheduledDay?.trim(),
      scheduledTime: this.scheduledTime?.trim(),
      notes: this.notes?.trim(),
      needsToRun: this.needsToRun,
      completed: this.completed
    };
    this.close();
  }

  protected onNeedsToRunChanged(needsToRun: boolean) {
    this.needsToRun = needsToRun;
  }

  protected onCompletedChanged(completed: boolean) {
    this.completed = completed;
  }

  private getFormErrors(): string[] {
    const errors: string[] = [];
    return errors;
  }
}
