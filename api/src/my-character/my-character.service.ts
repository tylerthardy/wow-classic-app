import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { IGetMyCharacter, IPostMyCharacter } from 'classic-companion-core';
import { MyCharactersTableService } from '../common/my-characters-table/my-characters-table.service';

@Injectable()
export class MyCharacterService {
  constructor(private tableService: MyCharactersTableService) {}

  public async saveAll(username: string, characters: IMyCharacterSave[]) {
    const characterRequests: Promise<void>[] = [];
    characters.forEach((character: IMyCharacterSave) => {
      characterRequests.push(this.save(username, character));
    });
    await Promise.all(characterRequests);
  }
  public async save(username: string, character: IMyCharacterSave): Promise<void> {
    const result: PutCommandOutput = await this.tableService.storeMyCharacter(
      username,
      character.regionSlug,
      character.serverSlug,
      character.characterName,
      character
    );

    if (result.$metadata.httpStatusCode !== 200) {
      const message: string = 'Error while saving my-character';
      Logger.error(message, {
        metadata: { ...result.$metadata },
        username,
        character
      });
      throw new Error(message);
    }
  }
  public async getAll(username: string): Promise<IMyCharacterSave[]> {
    const result: IMyCharacterSave[] = await this.tableService.getAllMyCharacters(username);
    return result;
  }
  public async get(
    username: string,
    regionSlug: string,
    serverSlug: string,
    characterName: string
  ): Promise<IMyCharacterSave> {
    const result: IMyCharacterSave = await this.tableService.getMyCharacter(
      username,
      regionSlug,
      serverSlug,
      characterName
    );
    return result;
  }
}

export interface IMyCharacterSave extends IPostMyCharacter {}
export interface IMyCharacterGet extends IGetMyCharacter {}
