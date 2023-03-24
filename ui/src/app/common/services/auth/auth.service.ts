import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUserSession, ICognitoUserPoolData } from 'amazon-cognito-identity-js';
import { AppConfig } from '../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private appConfig: AppConfig) {}

  get isLoggedIn(): boolean {
    let isAuth = false;

    const poolData: ICognitoUserPoolData = {
      UserPoolId: this.appConfig.cognito.userPoolId,
      ClientId: this.appConfig.cognito.userPoolWebClientId
    };

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

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
