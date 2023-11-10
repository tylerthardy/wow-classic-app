import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDefined, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IMyCharacterLockoutSaveLockout, IPostMyCharacter } from 'classic-companion-core';
import { IsWowUsername } from '../../common/validators/is-wow-username.validator';

export class PostMyCharacterBody implements IPostMyCharacter {
  @IsDefined()
  @IsWowUsername()
  characterName!: string;

  @IsDefined()
  @IsString()
  regionSlug!: string;

  @IsDefined()
  @IsString()
  serverSlug!: string;

  @IsDefined()
  @IsBoolean()
  hidden!: boolean;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MyCharacterLockout)
  lockouts!: MyCharacterLockout[];

  // TODO: Enum eventually
  @IsOptional()
  @IsString()
  classSlug?: string | undefined;
}

class MyCharacterLockout implements IMyCharacterLockoutSaveLockout {
  @IsDefined()
  @IsString()
  raidSlug!: string;

  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsNeeded!: number[];

  @IsDefined()
  @IsBoolean()
  needsToRun!: boolean;

  @IsDefined()
  @IsNumber()
  manuallyCompletedOn!: number;

  @IsOptional()
  @IsNumber()
  expires?: number | undefined;

  @IsOptional()
  @IsString()
  scheduledDay?: string | undefined;

  @IsOptional()
  @IsString()
  scheduledTime?: string | undefined;

  @IsOptional()
  @IsString()
  notes?: string | undefined;
}
