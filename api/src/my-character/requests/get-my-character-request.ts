import { IsDefined, IsString } from 'class-validator';
import { IGetMyCharacter } from 'classic-companion-core';
import { IsWowUsername } from '../../common/validators/is-wow-username.validator';

export class GetMyCharacterRequest implements IGetMyCharacter {
  @IsDefined()
  @IsString()
  @IsWowUsername()
  name!: string;

  @IsDefined()
  @IsString()
  serverSlug!: string;

  @IsDefined()
  @IsString()
  regionSlug!: string;
}
