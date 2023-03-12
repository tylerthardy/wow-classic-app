import { Component } from '@angular/core';
import myGear from '../common/gear/my-character.json';
import pallyGear from '../common/gear/my-paladin.json';
import gear from '../common/gear/warlock.gear-presets.json';
import { IWowSimsExport } from '../common/gear/wowsims-export.interface';
import { LocalStorageService } from '../common/services/local-storage.service';
import { ToastService } from '../common/services/toast/toast.service';
import { ICharacter } from './character.interface';

@Component({
  selector: 'app-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss']
})
export class MyCharactersComponent {
  public gear = gear;
  public myGear = myGear.Current.gear as any;

  public wseInput?: string;
  public selectedCharacterIndex: number = 0;

  public myCharacters: ICharacter[] = [
    {
      name: 'Warterter',
      metric: 'dps',
      gear: myGear.Current.gear as any
    },
    {
      name: 'Pertadin',
      metric: 'dps',
      gear: pallyGear.Current.gear as any
    }
  ];

  constructor(private localStorageService: LocalStorageService, private toastService: ToastService) {
    this.loadCharacters();
  }

  public onWseImportClick(): void {
    if (!this.wseInput) {
      this.toastService.warn('Invalid Import', 'Add value to the import'); // FIXME: Tone is all wrong
      return;
    }
    const wowSimsImport: IWowSimsExport = JSON.parse(this.wseInput);
    this.myGear = wowSimsImport.gear;

    const matchedCharacter: ICharacter | undefined = this.myCharacters.find(
      (c) => c.name.toLowerCase() === wowSimsImport.name.toLowerCase()
    );
    if (matchedCharacter) {
      matchedCharacter.gear = wowSimsImport.gear;
    } else {
      const newCharacter: ICharacter = {
        gear: wowSimsImport.gear,
        metric: 'dps',
        name: wowSimsImport.name
      };
      this.myCharacters.push(newCharacter);
    }
    this.storeCharacters();
  }

  private loadCharacters(): void {
    const loadedCharacters = this.localStorageService.get('myCharacters', 'characterList');
    this.myCharacters = loadedCharacters.length > 0 ? loadedCharacters : this.myCharacters;
  }

  private storeCharacters(): void {
    this.localStorageService.store('myCharacters', 'characterList', this.myCharacters);
  }
}
