import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

const defaultOptions: Partial<IndividualConfig> = {
  positionClass: 'custom-toast-top-right',
  progressBar: true,
  progressAnimation: 'decreasing',
  timeOut: 2500
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {
    toastr.overlayContainer;
  }

  public success(title: string, message: string, additionalOptions?: Partial<IndividualConfig>) {
    this.toastr.success(message, title, {
      ...defaultOptions,
      timeOut: 3000,
      ...additionalOptions
    });
  }

  public info(title: string, message: string, additionalOptions?: Partial<IndividualConfig>) {
    this.toastr.info(message, title, {
      ...defaultOptions,
      ...additionalOptions
    });
  }

  public error(title: string, error: any, additionalOptions?: Partial<IndividualConfig>) {
    let message: string;
    if (typeof error === 'string') {
      message = error;
    } else {
      message = JSON.stringify(error);
    }
    this.toastr.error(message, title, {
      ...defaultOptions,
      disableTimeOut: true,
      closeButton: true,
      ...additionalOptions
    });
  }
}
