import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUserSession, ICognitoUserPoolData } from 'amazon-cognito-identity-js';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userpool: CognitoUserPool;

  constructor(private appConfig: AppConfig) {
    const poolData: ICognitoUserPoolData = {
      UserPoolId: this.appConfig.cognito.userPoolId,
      ClientId: this.appConfig.cognito.userPoolWebClientId
    };

    this.userpool = new CognitoUserPool(poolData);
  }

  public signOut(): void {
    const cognitoUser = this.userpool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
  }

  public async getToken(): Promise<string | undefined> {
    if (this.isLoggedIn) {
      const cognitoUser = this.userpool.getCurrentUser();
      if (cognitoUser != null) {
        return new Promise((resolve, reject) => {
          cognitoUser.getSession((err: any, session: CognitoUserSession) => {
            if (err) return reject(err);
            resolve(session.getIdToken().getJwtToken());
          });
        });
      }
    }
    return Promise.resolve(undefined);
  }

  // FIXME: This should be set by the api middleware, not calculated in the property. The property calculation can cause the UI to spam cognito with requests
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
          isAuth = session.isValid();
        }
      });
    }
    console.log('evaluating isLoggedIn', isAuth);
    return isAuth;
  }
}
