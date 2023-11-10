import { Injectable, PipeTransform } from '@nestjs/common';
import { JwtVerifierService } from '../../jwt-verifier.service';

@Injectable()
export class UsernamePipe implements PipeTransform {
  constructor(private jwtVerifier: JwtVerifierService) {}

  public async transform(value: string): Promise<string> {
    return (await this.jwtVerifier.getPayload(value)).username;
  }
}
