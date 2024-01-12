import { CognitoUserSession } from 'amazon-cognito-identity-js';

export class ApplicationUser {
  public session: CognitoUserSession;
  public get name(): string {
    return this.decodedToken['email'];
  }
  private decodedToken: { [key: string]: any };

  constructor(session: CognitoUserSession) {
    this.session = session;
    this.decodedToken = session.getIdToken().decodePayload();
  }
}
