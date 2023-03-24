import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ThemeService } from '../../common/services/theme/theme.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'sign-in-modal.component.html'
})
export class SignInModalComponent extends SimpleModalComponent<any, CognitoUserSession> {
  isLoading: boolean = false;
  email_address: string = '';
  password: string = '';

  constructor(public authService: AuthService, public themeService: ThemeService) {
    super();
  }

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.signIn(this.email_address, this.password, {
        onSuccess: (result) => {
          this.close();
        },
        onFailure: (err) => {
          alert(err.message || JSON.stringify(err));
          this.isLoading = false;
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {}
      });
    }
  }
}
