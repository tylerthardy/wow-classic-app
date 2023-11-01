import { Injectable } from '@angular/core';
import { IMyCharactersLockoutsSave } from 'classic-companion-core';
import { LocalStorageService } from '../common/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MyCharactersService {
  constructor(private localStorageService: LocalStorageService) {}

  public getAll(): IMyCharactersLockoutsSave | undefined {
    return this.localStorageService.get('my-characters-lockouts', 'lockouts');
  }

  public save(data: any): void {
    this.localStorageService.store('my-characters-lockouts', 'lockouts', data);
  }

  public saveCharacter(data: any): void {
    throw new Error('Not yet implemented');
  }
}
