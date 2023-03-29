import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastService } from './services/toast/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const errorMessage: string = error.message ?? error;
    const toastService: ToastService = this.injector.get(ToastService);
    console.error(error);

    // FIXME: A bit of a hacky way to check the error type
    if (errorMessage === 'Unauthenticated WCA Request') {
      toastService.warn('Unauthenticated', 'Please sign in to use this feature', {
        onActivateTick: true
      });
      return;
    }

    toastService.error('Unhandled Error', errorMessage, {
      onActivateTick: true
    });
  }
}
