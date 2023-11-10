import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { IPostMyCharacters } from 'classic-companion-core';
import { PostMyCharacterBody } from './post-my-character-body';

export class PostMyCharactersBody implements IPostMyCharacters {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PostMyCharacterBody)
  public characters!: PostMyCharacterBody[];
}
