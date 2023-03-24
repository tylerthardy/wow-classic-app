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

  public setNewPassword(password: string, userAttributes: any, authCallbacks: IAuthenticationCallback) {
    const cognitoUser: CognitoUser | null = this.userpool.getCurrentUser();
    if (!cognitoUser) {
      throw new Error('no cognito user');
    }
    // the api doesn't accept this field back
    delete userAttributes.email_verified;
    // store userAttributes on global variable
    cognitoUser.completeNewPasswordChallenge(password, userAttributes, authCallbacks);
  }

  public resetPassword(username: string): void {
    const cognitoUser: CognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userpool
    });
    cognitoUser.forgotPassword({
      onSuccess: (success: string) => {
        alert('password reset');
      },
      onFailure: (err: Error) => {
        alert(err);
      },
      inputVerificationCode(data: any) {
        console.log(data);

        // this is optional, and likely won't be implemented as in AWS's example (i.e, prompt to get info)
        var verificationCode = prompt('Please input verification code ', '');
        if (!verificationCode) {
          return;
        }
        var newPassword = prompt('Enter new password ', '');
        if (!newPassword) {
          return;
        }
        cognitoUser.confirmPassword(verificationCode, newPassword, this);
      }
    });
  }

  public signIn(emailAddress: string, password: string, resultCallbacks?: IAuthenticationCallback): void {
    let authenticationDetails = new AuthenticationDetails({
      Username: emailAddress,
      Password: password
    });

    var cognitoUser = new CognitoUser({ Username: emailAddress, Pool: this.userpool });
    let authCallbacks: IAuthenticationCallback = {
      onSuccess: (result: CognitoUserSession) => {
        this.setUser(result);
        resultCallbacks?.onSuccess(result);
      },
      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
        if (err.message === 'Password reset required for the user') {
          this.resetPassword(emailAddress);
          return;
        }
        resultCallbacks?.onFailure(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        if (resultCallbacks?.newPasswordRequired) {
          resultCallbacks.newPasswordRequired(userAttributes, requiredAttributes);
        }
      },
      customChallenge(challengeParameters) {
        if (resultCallbacks?.customChallenge) {
          resultCallbacks.customChallenge(challengeParameters);
        }
      },
      mfaRequired(challengeName, challengeParameters) {
        if (resultCallbacks?.mfaRequired) {
          resultCallbacks.mfaRequired(challengeName, challengeParameters);
        }
      },
      mfaSetup(challengeName, challengeParameters) {
        if (resultCallbacks?.mfaSetup) {
          resultCallbacks.mfaSetup(challengeName, challengeParameters);
        }
      },
      selectMFAType(challengeName, challengeParameters) {
        if (resultCallbacks?.selectMFAType) {
          resultCallbacks.selectMFAType(challengeName, challengeParameters);
        }
      },
      totpRequired(challengeName, challengeParameters) {
        if (resultCallbacks?.totpRequired) {
          resultCallbacks.totpRequired(challengeName, challengeParameters);
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
