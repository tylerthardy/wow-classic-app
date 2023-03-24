import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  IAuthenticationCallback,
  ICognitoUserPoolData
} from 'amazon-cognito-identity-js';
import { AppConfig } from '../config/app.config';
import { ApplicationUser } from './application-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: ApplicationUser | undefined;
  private userpool: CognitoUserPool;

  constructor(private appConfig: AppConfig) {
    const poolData: ICognitoUserPoolData = {
      UserPoolId: this.appConfig.cognito.userPoolId,
      ClientId: this.appConfig.cognito.userPoolWebClientId
    };

    this.userpool = new CognitoUserPool(poolData);
  }

  public signIn(emailAddress: string, password: string, resultCallbacks?: IAuthenticationCallback): void {
    let authenticationDetails = new AuthenticationDetails({
      Username: emailAddress,
      Password: password
    });

    let userData = { Username: emailAddress, Pool: this.userpool };
    var cognitoUser = new CognitoUser(userData);
    let authCallbacks: IAuthenticationCallback = {
      onSuccess: (result: CognitoUserSession) => {
        this.setUser(result);
        resultCallbacks?.onSuccess(result);
      },
      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
        resultCallbacks?.onFailure(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // the api doesn't accept this field back
        delete userAttributes.email_verified;

        // store userAttributes on global variable
        cognitoUser.completeNewPasswordChallenge('Potato123', userAttributes, authCallbacks);

        if (resultCallbacks?.newPasswordRequired) {
          resultCallbacks.newPasswordRequired(userAttributes, requiredAttributes);
        }
      }
    };
    cognitoUser.authenticateUser(authenticationDetails, authCallbacks);
  }

  public signOut(): void {
    const cognitoUser = this.userpool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut(() => {
        this.setUser(undefined);
      });
    }
  }

  public async getToken(): Promise<string | undefined> {
    if (this.isLoggedIn) {
      const cognitoUser = this.userpool.getCurrentUser();
      if (cognitoUser != null) {
        return new Promise((resolve, reject) => {
          cognitoUser.getSession((err: any, session: CognitoUserSession) => {
            if (err) return reject(err);
            this.setUser(session);
            resolve(session.getIdToken().getJwtToken());
          });
        });
      }
    }
    return Promise.resolve(undefined);
  }

  // FIXME: This should be set by the api middleware, not calculated in the property.
  // The property calculation can cause the UI to spam cognito with requests because getSession will refresh a token
  get isLoggedIn(): boolean {
    let isAuth = false;

    const cognitoUser = this.userpool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        } else if (!session) {
          alert(err.message || JSON.stringify(err));
        } else {
          this.setUser(session);
          isAuth = session.isValid();
        }
      });
    }
    return isAuth;
  }

  private setUser(session: CognitoUserSession | undefined) {
    if (!session) {
      this.user = undefined;
      return;
    }
    this.user = new ApplicationUser(session);
  }
}
