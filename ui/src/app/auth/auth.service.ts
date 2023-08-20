import { Injectable } from '@angular/core';
import { Auth } from '@aws-amplify/auth';
import { AuthOptions, OAuthOpts } from '@aws-amplify/auth/lib-esm/types';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Observable, catchError, from, map, of, take, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppConfig } from '../config/app.config';
import { CognitoConfig } from '../config/cognito-config.interface';
import { ApplicationUser } from './application-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: ApplicationUser | undefined;
  private config: CognitoConfig;
  private apiScope: string = 'api-resource-server/api';

  constructor(appConfig: AppConfig) {
    this.config = appConfig.cognito;
  }

  public initialize(): void {
    console.log('authService.initialize');
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
    console.log('authService.getSession');
    return from(Auth.currentSession()).pipe(
      take(1),
      tap((session) => this.setUser(session)),
      catchError((error) => {
        console.error('error caught', error);
        return of(undefined);
      })
    );
  }

  public signUp(): void {
    const url: string = this.getCognitoHostedUrl('signup');
    window.location.assign(url);
  }

  public signIn(): void {
    const url: string = this.getCognitoHostedUrl('login');
    window.location.assign(url);
  }

  public signOut(): void {
    this.setUser(undefined);
    const url: string = this.getCognitoHostedUrl('logout');
    window.location.assign(url);
  }

  private setUser(session: CognitoUserSession | undefined) {
    console.log('authService.setUser');
    if (!session) {
      this.user = undefined;
      return;
    }
    this.user = new ApplicationUser(session);
  }

  private getCognitoHostedUrl(type: 'login' | 'logout' | 'signup'): string {
    const encodedScope: string = encodeURIComponent(this.apiScope);
    const encodedRedirectUri: string = encodeURIComponent(this.config.redirectUri);
    if (type === 'login') {
      return `https://${this.config.authUrl}/login?client_id=${this.config.userPoolWebClientId}&response_type=code&scope=${encodedScope}+openid+profile&redirect_uri=${encodedRedirectUri}`;
    } else if (type === 'logout') {
      return `https://${this.config.authUrl}/logout?client_id=${this.config.userPoolWebClientId}&response_type=code&logout_uri=${encodedRedirectUri}&redirect_uri=${encodedRedirectUri}`;
    } else if (type === 'signup') {
      return `https://${this.config.authUrl}/signup?client_id=${this.config.userPoolWebClientId}&response_type=code&scope=${encodedScope}+openid+profile&redirect_uri=${encodedRedirectUri}`;
    } else {
      return `https://${this.config.authUrl}`;
    }
  }
}
