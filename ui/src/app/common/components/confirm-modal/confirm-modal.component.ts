import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ThemeService } from '../../services/theme/theme.service';
import { ConfirmModalOptions } from './confirm-modal-options.interface';

@Component({
  selector: 'confirm',
  templateUrl: 'confirm-modal.component.html'
})
export class ConfirmModalComponent
  extends SimpleModalComponent<ConfirmModalOptions, boolean>
  implements ConfirmModalOptions
{
  title!: string;
  message!: string;

  constructor(public themeService: ThemeService) {
    super();
  }
  confirm() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = true;
    this.close();
  }
}
