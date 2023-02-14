import { Module } from '@nestjs/common';
import { WarcraftLogsService } from '../warcraft-logs/warcraft-logs.service';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
  imports: [],
  providers: [CharacterService, WarcraftLogsService],
  controllers: [CharacterController]
})
export class CharacterModule {}
