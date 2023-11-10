import { Module } from '@nestjs/common';
import { JwtVerifierService } from '../common/jwt-verifier.service';
import { MyCharactersTableService } from '../common/my-characters-table/my-characters-table.service';
import { MyCharacterController } from './my-character.controller';
import { MyCharacterService } from './my-character.service';

@Module({
  providers: [MyCharacterService, JwtVerifierService, MyCharactersTableService],
  controllers: [MyCharacterController]
})
export class MyCharacterModule {}
