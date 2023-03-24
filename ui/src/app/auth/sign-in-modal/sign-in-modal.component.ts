import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  IAuthenticationCallback
} from 'amazon-cognito-identity-js';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { environment } from '../../../environments/environment';
import { ThemeService } from '../../common/services/theme/theme.service';

@Component({
  templateUrl: 'sign-in-modal.component.html'
})
export class SignInModalComponent extends SimpleModalComponent<any, CognitoUserSession> {
  isLoading: boolean = false;
  email_address: string = '';
  password: string = '';

  constructor(public themeService: ThemeService) {
    super();
  }

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      let authenticationDetails = new AuthenticationDetails({
        Username: this.email_address,
        Password: this.password
      });
      let poolData = {
        UserPoolId: environment.cognito.userPoolId,
        ClientId: environment.cognito.userPoolWebClientId
      };

      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.email_address, Pool: userPool };
      var cognitoUser = new CognitoUser(userData);
      let authCallbacks: IAuthenticationCallback = {
        onSuccess: (result) => {
          this.result = result;
          this.close();
        },
        onFailure: (err) => {
          alert(err.message || JSON.stringify(err));
          this.isLoading = false;
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // the api doesn't accept this field back
          delete userAttributes.email_verified;

          // store userAttributes on global variable
          cognitoUser.completeNewPasswordChallenge('Potato123', userAttributes, authCallbacks);
        }
      };
      cognitoUser.authenticateUser(authenticationDetails, authCallbacks);
    }
  }
}
