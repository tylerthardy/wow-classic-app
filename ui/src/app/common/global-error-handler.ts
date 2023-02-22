import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastService } from './services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    console.error(error);
    const errorMessage: string = error.message ?? error;
    const toastService: ToastService = this.injector.get(ToastService);
    toastService.error('Unhandled Error', errorMessage, {
      onActivateTick: true
    });
  }
}
