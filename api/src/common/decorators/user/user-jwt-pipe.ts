import { Injectable, PipeTransform } from '@nestjs/common';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { JwtVerifierService } from '../../jwt-verifier.service';

@Injectable()
export class UserJwtPipe implements PipeTransform {
  constructor(private jwtVerifier: JwtVerifierService) {}

  public async transform(value: string): Promise<CognitoAccessTokenPayload> {
    return this.jwtVerifier.getPayload(value);
  }
}
