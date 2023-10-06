import { Injectable } from '@angular/core';
import { LocalStorageService } from '../common/services/local-storage.service';
import { Character } from './character';
import { NitImport } from './my-characters-lockouts/models/imports/nit-import.interface';
import { IStoredCharacter } from './stored-character.interface';

type CharactersByName = { [characterName: string]: Character };

@Injectable({
  providedIn: 'root'
})
export class MyCharactersService {
  public characters: Character[] = [];
  // public charactersByName: CharactersByName = {};

  constructor(private localStorageService: LocalStorageService) {
    this.load();
  }

  public save(): void {
    const storedCharacters: IStoredCharacter[] = this.characters.map((character) => {
      const storedCharacter: IStoredCharacter = {
        name: character.name,
        metric: character.metric,
        gear: character.gear,
        className: character.wowClass.name,
        specName: character.specialization?.name
      };
      return storedCharacter;
    });
    this.localStorageService.store('myCharacters', 'characterList', storedCharacters);
    this.characters = [...this.characters]; // This is done so that all change detection will pick up character changes
  }

  public load(): void {
    const storedCharacters = this.localStorageService.get('myCharacters', 'characterList');
    if (!storedCharacters) {
      return;
    }

    this.characters = storedCharacters.map((storedCharacter: IStoredCharacter) => new Character(storedCharacter));
  }

  public add(character: Character): void {
    if (this.get(character.name)) {
      throw new Error('character already exists');
    }
    this.characters.push(character);
  }

  public delete(characterName: string): boolean {
    const deleteCharacterIdx: number = this.characters.findIndex(
      (character) => character.name.toLowerCase() === characterName.toLowerCase()
    );
    if (deleteCharacterIdx === -1) {
      return false;
    }
    this.characters.splice(deleteCharacterIdx, 1);
    return true;
  }

  public get(characterName: string): Character | undefined {
    const charactersByName: CharactersByName = this.getCharactersByName();
    return charactersByName[characterName];
  }

  public patchNitImport(nitImport: NitImport): void {
    const charactersByName: CharactersByName = this.getCharactersByName();
    Object.entries(nitImport.characters).forEach(([characterName, nitCharacter]) => {
      const existingCharacter: Character | undefined = charactersByName[characterName];
      if (existingCharacter) {
        existingCharacter.patchNitImport(nitCharacter);
      } else {
        // TODO: Capture metric & gear with a modal
        this.add(
          new Character({
            name: characterName,
            className: nitCharacter.classEnglish,
            metric: 'dps',
            gear: { items: [] }
          })
        );
      }
    });
    this.save();
  }

  private getCharactersByName(): CharactersByName {
    const charactersByName: CharactersByName = {};
    this.characters.forEach((character) => {
      charactersByName[character.name] = character;
    });
    return charactersByName;
  }
}
