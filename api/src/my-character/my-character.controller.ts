import { Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { NotFoundError } from 'common-errors';
import { UsernamePipe } from '../common/decorators/user';
import { User } from '../common/decorators/user/user-decorator';
import { JwtVerifierService } from '../common/jwt-verifier.service';
import { IMyCharacterSave, MyCharacterService } from './my-character.service';
import { GetMyCharacterRequest } from './requests/get-my-character-request';
import { PostMyCharacterBody } from './requests/post-my-character-body';
import { PostMyCharactersBody } from './requests/post-my-characters-body';

@Controller('my-characters')
export class MyCharacterController {
  constructor(private myCharactersService: MyCharacterService, private jwtService: JwtVerifierService) {}

  @Get()
  public async getAll(@User(UsernamePipe) username: string): Promise<IMyCharacterSave[]> {
    const characters: IMyCharacterSave[] = await this.myCharactersService.getAll(username);
    return characters;
  }

  @Get('character')
  public async get(
    @Query() query: GetMyCharacterRequest,
    @User(UsernamePipe) username: string
  ): Promise<IMyCharacterSave> {
    try {
      return await this.myCharactersService.get(username, query.regionSlug, query.serverSlug, query.name);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException('character not found');
      }
      throw error;
    }
  }

  @Post()
  public async saveAll(@Body() body: PostMyCharactersBody, @User(UsernamePipe) username: string): Promise<any> {
    await this.myCharactersService.saveAll(username, body.characters);
  }

  @Post('character')
  public async saveCharacter(@Body() body: PostMyCharacterBody, @User(UsernamePipe) username: string): Promise<any> {
    await this.myCharactersService.save(username, body);
  }
}
