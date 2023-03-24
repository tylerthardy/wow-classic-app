import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CognitoUserSession, IAuthenticationCallback } from 'amazon-cognito-identity-js';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ThemeService } from '../../common/services/theme/theme.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'sign-in-modal.component.html',
  styleUrls: ['sign-in-modal.component.scss']
})
export class SignInModalComponent extends SimpleModalComponent<any, CognitoUserSession> {
  isLoading: boolean = false;
  email_address: string = '';
  password: string = '';

  constructor(public authService: AuthService, public themeService: ThemeService) {
    super();
  }

  public onSignInFormSubmit(form: NgForm) {
    // if (form.valid) {
    this.isLoading = true;
    setTimeout(() => {
      const authCallbacks: IAuthenticationCallback = {
        onSuccess: (result: CognitoUserSession) => {
          this.result = result;
          this.close();
        },
        onFailure: (err) => {
          this.isLoading = false;
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          throw new Error("new password required, but it shouldn't be");
        }
      };
      this.authService.signIn(this.email_address, this.password, authCallbacks);
    }, 100000);
    // }
  }

  public onForgotPasswordClick(): void {
    this.authService.resetPassword(this.email_address);
  }
}
