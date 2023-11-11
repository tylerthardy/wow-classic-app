import {
  IMyCharactersLockoutsSave,
  IMyCharactersLockoutsSaveCharacter,
  MyCharactersLockoutsSave
} from 'classic-companion-core';
import { CharacterRaidStatus } from '../character-raid-status.model';
import { NitImport, NitImportCharacter, NitImportLockout } from '../imports/nit-import.interface';
import { CharacterLockoutsViewModel } from './character-lockouts.viewmodel';
export class MyCharactersLockoutsViewModel {
  public data: CharacterLockoutsViewModel[];
  public showHidden: boolean = false;

  public get filteredData(): CharacterLockoutsViewModel[] {
    return this.data.filter((x) => !x.hidden || this.showHidden);
  }

  constructor(importedData: NitImport | MyCharactersLockoutsSave) {
    if (importedData instanceof MyCharactersLockoutsSave) {
      this.data = importedData.characters.map((char) => {
        return new CharacterLockoutsViewModel(
          char.characterName,
          char.classSlug,
          char.lockouts,
          char.currencies,
          char.hidden
        );
      });
    } else {
      this.data = Object.entries(importedData.characters).map((kvp) => {
        const characterName: string = kvp[0];
        const character: NitImportCharacter = kvp[1];
        const lockouts: NitImportLockout[] = character.instances;
        const currencies: {} = {};
        return new CharacterLockoutsViewModel(characterName, character.classEnglish, lockouts, currencies);
      });
    }
  }

  public patchData(imported: MyCharactersLockoutsViewModel): void {
    const dataByCharacterName: { [characterName: string]: CharacterLockoutsViewModel } = {};
    this.data.map((character) => {
      dataByCharacterName[character.characterName] = character;
    });
    imported.data.forEach((importedCharacter) => {
      const existingCharacter: CharacterLockoutsViewModel = dataByCharacterName[importedCharacter.characterName];
      if (!existingCharacter) {
        this.data.push(importedCharacter);
        return;
      }
      existingCharacter.wowClass = importedCharacter.wowClass;
      importedCharacter.raidStatuses.forEach((importedStatus, raid, _) => {
        const existingStatus: CharacterRaidStatus | undefined = existingCharacter.raidStatuses.get(raid);
        if (!existingStatus) {
          throw new Error('unable to find existing raid for imported raid status ' + raid.slug);
        }
        existingStatus.manuallyCompletedOn = importedStatus.manuallyCompletedOn;
        existingStatus.expires = importedStatus.expires;
      });
    });
  }

  public getSaveableData(): IMyCharactersLockoutsSave {
    const characters: IMyCharactersLockoutsSaveCharacter[] = this.data.map((characterData) =>
      characterData.getSaveableData()
    );

    return {
      version: '0.1',
      showHidden: this.showHidden,
      characters
    };
  }
}
