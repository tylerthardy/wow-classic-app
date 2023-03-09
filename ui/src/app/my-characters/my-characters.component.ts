import { Component } from '@angular/core';
import { LocalStorageService } from '../common/services/local-storage.service';
import { ICharacter } from './character.interface';

@Component({
  selector: 'app-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss']
})
export class MyCharactersComponent {
  public myCharacters: ICharacter[] = [
    {
      name: 'Warterter',
      metric: 'dps'
    },
    {
      name: 'Rerterter',
      metric: 'dps'
    },
    {
      name: 'Merterter',
      metric: 'dps'
    },
    {
      name: 'Sperticus',
      metric: 'dps'
    },
    {
      name: 'Sherterter',
      metric: 'dps'
    },
    {
      name: 'Jaelle',
      metric: 'hps'
    }
  ];
  constructor(private localStorageService: LocalStorageService) {
    this.myCharacters = this.myCharacters ?? this.localStorageService.get('myCharacters', 'characterList');
  }
}
