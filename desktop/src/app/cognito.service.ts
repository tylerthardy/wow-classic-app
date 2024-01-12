import { Injectable } from '@angular/core';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { AuthOptions, OAuthOpts } from '@aws-amplify/auth/lib-esm/types';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { BehaviorSubject, Observable, catchError, from, map, of, take, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { ApplicationUser } from './application-user';

export interface IUserLogin {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

// FIXME: Duplicated from UI. Use a shared service
@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  public user: ApplicationUser | undefined;
  public authenticated$: BehaviorSubject<any>;
  private apiScope: string = 'api-resource-server/api';

  constructor() {
    this.authenticated$ = new BehaviorSubject<boolean>(false);
  }

  public initialize(): void {
    console.log('CognitoService.initialize');
    const config = environment.cognito;
    const oauth: OAuthOpts = {
      domain: config.authUrl,
      // profile and openid are needed for cognito profile data
      scope: [this.apiScope, 'profile', 'openid'],
      redirectSignIn: config.redirectUri,
      redirectSignOut: config.redirectUri,
      responseType: 'code'
    };
    const authConfig: AuthOptions = {
      oauth,
      userPoolId: config.userPoolId,
      userPoolWebClientId: config.userPoolWebClientId,
      storage: localStorage
    };
    Auth.configure(authConfig);
  }

  public getAccessToken(): Observable<string | undefined> {
    console.log('CognitoService.getAccessToken');
    // Using getSession performs a refresh on the token if expired, rather than pulling from cached this.user
    return this.getSession().pipe(
      map((session) => {
        // Check to see the user is signed in
        if (!this.user) {
          throwError(() => 'No user session to obtain token');
        }
        return session?.getAccessToken().getJwtToken();
      })
    );
  }

  public getSession(): Observable<CognitoUserSession | undefined> {
    console.log('CognitoService.getSession');
    debugger;
    return from(Auth.currentSession()).pipe(
      take(1),
      tap((session) => this.setUser(session)),
      catchError((error) => {
        console.error('error caught', error);
        return of(undefined);
      })
    );
  }

  public getUser(): Promise<any> {
    console.log('CognitoService.getUser');
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUserLogin): Promise<any> {
    console.log('CognitoService.updateUser', user);
    return Auth.currentUserPoolUser().then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    console.log('CognitoService.isAuthenticated', this.authenticated$.value);
    if (this.authenticated$.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user: any) => {
          console.log('CognitoService.isAuthenticated userReturned', user);
          if (user) {
            this.user = user as unknown as ApplicationUser;
            console.log('CognitoService.isAuthenticated return', true);
            return true;
          } else {
            console.log('CognitoService.isAuthenticated return', false);
            return false;
          }
        })
        .catch(() => {
          return false;
        });
    }
  }

  public signUp(user: IUserLogin): Promise<any> {
    console.log('CognitoService.signUp', user);
    return Auth.signUp({
      username: user.email,
      password: user.password
    });
  }

  public confirmSignUp(user: IUserLogin): Promise<any> {
    console.log('CognitoService.confirmSignUp', user);
    return Auth.confirmSignUp(user.email, user.code);
  }

  public async signIn(user: IUserLogin): Promise<any> {
    console.log('CognitoService.signIn', user);
    const userResult: CognitoUser = await Auth.signIn(user.email, user.password);
    if (userResult) {
      console.log('CognitoService.signIn result', userResult);
      this.authenticated$.next(true);
    }
  }

  public signOut(): Promise<any> {
    console.log('CognitoService.signOut');
    return Auth.signOut().then(() => {
      this.authenticated$.next(false);
    });
  }

  private setUser(session: CognitoUserSession | undefined) {
    console.log('CognitoService.setUser', session);
    if (!session) {
      this.user = undefined;
      return;
    }
    this.user = new ApplicationUser(session);
  }
}
