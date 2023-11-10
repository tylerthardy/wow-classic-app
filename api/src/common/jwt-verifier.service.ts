import { Injectable } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import {
  CognitoJwtVerifierProperties,
  CognitoJwtVerifierSingleUserPool,
  CognitoVerifyProperties
} from 'aws-jwt-verify/cognito-verifier';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Properties } from 'aws-jwt-verify/typing-util';
import { AppConfig } from '../app-config';

@Injectable()
export class JwtVerifierService {
  private verifierProperties: CognitoJwtVerifierProperties;
  private verifier: CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>;
  private verifyProperties: Properties<CognitoVerifyProperties, CognitoJwtVerifierProperties>;

  constructor(appConfig: AppConfig) {
    this.verifierProperties = {
      userPoolId: appConfig.userPoolId,
      tokenUse: 'access',
      clientId: appConfig.userPoolClientId
    };
    this.verifyProperties = {
      clientId: this.verifierProperties.clientId!,
      tokenUse: this.verifierProperties.tokenUse!
    };
    this.verifier = CognitoJwtVerifier.create(this.verifierProperties);
  }

  public async getPayload(jwtString: string): Promise<CognitoAccessTokenPayload> {
    try {
      const payload = await this.verifier.verify(jwtString, this.verifyProperties);
      return payload as CognitoAccessTokenPayload;
    } catch (err) {
      console.log(`Token not valid: ${err}`);
      throw new Error('Token not valid');
    }
  }
}
