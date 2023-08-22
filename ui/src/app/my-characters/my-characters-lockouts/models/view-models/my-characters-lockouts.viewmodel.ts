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
    // TODO: REFACTOR THIS. Seems like a lot of iterating & transforming for something simple
    // const characterLockouts: { [characterName: string]: LockoutData[] } = {};
    // for (const characterName of Object.keys(lockouts)) {
    //   const lockoutData: INitImportLockout[] = lockouts[characterName];
    //   characterLockouts[characterName] = [];

    //   lockoutData.forEach((lockoutDatum) => {
    //     const lockout: LockoutData = new LockoutData(lockoutDatum);
    //     if (!!lockout.raid) {
    //       characterLockouts[characterName].push(lockout);
    //     }
    //   });
    // }

    // this.data = Object.entries(characterLockouts).map((kvp) => {
    //   const characterName: string = kvp[0];
    //   const lockouts: LockoutData[] = kvp[1];
    //   return new CharacterLockoutsViewModel(characterName, lockouts);
    // });
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
