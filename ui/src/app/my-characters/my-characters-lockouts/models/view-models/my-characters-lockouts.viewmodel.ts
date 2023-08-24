import { Raid } from 'classic-companion-core';
import { CharacterRaidStatus } from '../character-raid-status.model';
import {
  IMyCharactersLockoutsSave,
  IMyCharactersLockoutsSaveCharacter,
  MyCharactersLockoutsSave
} from '../imports/my-characters-lockouts-save.interface';
import { NitImport, NitImportLockout } from '../imports/nit-import.interface';
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
        return new CharacterLockoutsViewModel(char.characterName, char.lockouts, char.hidden);
      });
    } else {
      this.data = Object.entries(importedData.lockouts).map((kvp) => {
        const characterName: string = kvp[0];
        const lockouts: NitImportLockout[] = kvp[1];
        return new CharacterLockoutsViewModel(characterName, lockouts);
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
      importedCharacter.raidStatuses.forEach((importedStatus, raid, _) => {
        const existingStatus: CharacterRaidStatus | undefined = existingCharacter.raidStatuses.get(raid);
        if (!existingStatus) {
          throw new Error('unable to find existing raid for imported raid status ' + raid.slug);
        }
        existingStatus.completed = importedStatus.completed;
        existingStatus.expires = importedStatus.expires;
      });
    });
  }

  public getSaveableData(): IMyCharactersLockoutsSave {
    const characters: IMyCharactersLockoutsSaveCharacter[] = this.data.map((characterData) => {
      const character: IMyCharactersLockoutsSaveCharacter = {
        characterName: characterData.characterName,
        hidden: characterData.hidden,
        lockouts: []
      };
      for (const kvp of characterData.raidStatuses.entries()) {
        const raid: Raid = kvp[0];
        const lockout: CharacterRaidStatus = kvp[1];
        if (!lockout.completed && !lockout.hasCustomData()) {
          continue;
        }
        const data = {
          raidSlug: raid.slug,
          itemsNeeded: lockout.itemsNeeded,
          needsToRun: lockout.needsToRun,
          completed: lockout.completed,
          expires: lockout.expires,
          scheduledDay: lockout.scheduledDay,
          scheduledTime: lockout.scheduledTime,
          notes: lockout.notes
        };
        character.lockouts.push(data);
      }
      return character;
    });

    return {
      version: '0.1',
      showHidden: this.showHidden,
      characters
    };
  }
}
