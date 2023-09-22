import { Raid } from 'classic-companion-core';
import { CharacterRaidStatus } from '../character-raid-status.model';
import {
  MyCharactersLockoutsSave,
  MyCharactersLockoutsSaveCharacter
} from '../imports/my-characters-lockouts-save.interface';
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
        return new CharacterLockoutsViewModel(char.characterName, char.classSlug, char.lockouts, char.hidden);
      });
    } else {
      this.data = Object.entries(importedData.characters).map((kvp) => {
        const characterName: string = kvp[0];
        const character: NitImportCharacter = kvp[1];
        const lockouts: NitImportLockout[] = character.instances;
        return new CharacterLockoutsViewModel(characterName, character.classEnglish, lockouts);
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

  public getSaveableData(): MyCharactersLockoutsSave {
    const characters: MyCharactersLockoutsSaveCharacter[] = this.data.map((characterData) => {
      const character: MyCharactersLockoutsSaveCharacter = new MyCharactersLockoutsSaveCharacter({
        characterName: characterData.characterName,
        classSlug: characterData.wowClass.slug,
        hidden: characterData.hidden,
        lockouts: []
      });
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
          manuallyCompletedOn: lockout.manuallyCompletedOn,
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
