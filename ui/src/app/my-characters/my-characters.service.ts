import { Injectable } from '@angular/core';
import { LocalStorageService } from '../common/services/local-storage.service';
import { Character } from './character';
import { MyCharactersLockoutsSave } from './my-characters-lockouts/models/imports/my-characters-lockouts-save.interface';
import { IStoredCharacter } from './stored-character.interface';

@Injectable({
  providedIn: 'root'
})
export class MyCharactersService {
  public characters: Character[] = [];

  constructor(private localStorageService: LocalStorageService) {}

  public saveCharacters(): void {
    const storedCharacters: IStoredCharacter[] = this.characters.map((character) => {
      const storedCharacter: IStoredCharacter = {
        name: character.name,
        metric: character.metric,
        gear: character.gear,
        className: character.wowClass.name,
        specName: character.specialization.name
      };
      return storedCharacter;
    });
    this.localStorageService.store('myCharacters', 'characterList', storedCharacters);
  }

  public loadCharacters(): void {
    const storedCharacters = this.localStorageService.get('myCharacters', 'characterList');
    this.characters = storedCharacters
      ? storedCharacters.map((storedCharacter: IStoredCharacter) => new Character(storedCharacter))
      : [];
    this.loadCharacterDataToDeprecate();
  }

  // TODO: Deprecate both of these by making it generalized to the characters/service
  private loadCharacterDataToDeprecate(): void {
    const saveData: any | undefined = this.localStorageService.get('my-characters-lockouts', 'lockouts');
    if (!saveData) {
      return;
    }
    const loadedSave = new MyCharactersLockoutsSave(saveData);
    const characterLookup: { [characterName: string]: Character } = {};
    this.characters.forEach((character) => {
      characterLookup[character.name] = character;
    });
    for (let loadedCharacter of loadedSave.characters) {
      const foundCharacter: Character | undefined = characterLookup[loadedCharacter.characterName];
      if (!foundCharacter) continue;
      console.log('patching ' + foundCharacter.name);
      foundCharacter.patchLockoutData(loadedCharacter.lockouts);
    }
  }
  private loadCharacterLockoutDataToDeprecate(): void {}
}
