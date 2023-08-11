import { Component } from '@angular/core';
import { IWowSimsExport, Specialization, WowClasses } from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { finalize } from 'rxjs';
import { LocalStorageService } from '../common/services/local-storage.service';
import { SpecializationService } from '../common/services/specialization/specialization.service';
import { ToastService } from '../common/services/toast/toast.service';
import { Character } from './character';
import { IMyCharacterImportModalInput } from './my-character-import-modal/my-character-import-modal-input.interface';
import { IMyCharacterImportModalOutput } from './my-character-import-modal/my-character-import-modal-output.interface';
import { MyCharacterImportModalComponent } from './my-character-import-modal/my-character-import-modal.component';
import { IStoredCharacter } from './stored-character.interface';

// FIXME: Should we use a view model here? Probably. It would clean up the template
@Component({
  selector: 'app-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss']
})
export class MyCharactersComponent {
  public compareSets?: IWowSimsExport[];
  public wseInput?: string;
  public selectedCharacterIndex: number = 0;
  public myCharacters: Character[] = [];
  public selectedSet?: IWowSimsExport;
  public gearSetsLoading: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private specializationService: SpecializationService,
    private simpleModalService: SimpleModalService
  ) {
    this.loadCharacters();
  }

  public onWseImportClick(): void {
    if (!this.wseInput) {
      this.toastService.warn('Invalid Import', 'Add value to the import'); // FIXME: Tone is all wrong
      return;
    }
    const wowSimsImport: IWowSimsExport = JSON.parse(this.wseInput);

    let matchedCharacter: Character | undefined = this.myCharacters.find(
      (c) => c.name.toLowerCase() === wowSimsImport.name.toLowerCase()
    );
    if (matchedCharacter) {
      matchedCharacter.gear = wowSimsImport.gear;
      this.toastService.info('Character Updated', 'Imported data to existing character');
      this.storeCharacters();
    } else {
      const data: IMyCharacterImportModalInput = {
        name: wowSimsImport.name,
        wowClass: WowClasses.getClassByName(wowSimsImport.class)
      };
      this.simpleModalService
        .addModal(MyCharacterImportModalComponent, data)
        .subscribe((result: IMyCharacterImportModalOutput) => {
          if (result) {
            const newCharacter: Character = new Character({
              gear: wowSimsImport.gear,
              metric: result.metric,
              name: result.name,
              className: result.wowClass.name,
              specName: result.specialization.name
            });
            const length = this.myCharacters.push(newCharacter);
            this.setSelectedCharacter(length - 1);
            this.storeCharacters();
          }
        });
    }
  }

  public onSelectedCharacterChange(changeEvent: Event) {
    const inputTarget: HTMLInputElement | null = changeEvent.target as HTMLInputElement;
    if (!inputTarget) {
      return;
    }
    this.loadCharacterGearSets();
  }

  public onDeleteCharacterClick(characterIndex: number): void {
    this.myCharacters.splice(characterIndex, 1);
    this.storeCharacters();
  }

  public onEditCharacterClick(characterIndex: number): void {
    const character: Character = this.myCharacters[characterIndex];
    const data: IMyCharacterImportModalInput = {
      name: character.name,
      metric: character.metric,
      wowClass: character.wowClass,
      specialization: character.specialization
    };
    this.simpleModalService
      .addModal(MyCharacterImportModalComponent, data)
      .subscribe((result: IMyCharacterImportModalOutput) => {
        if (result) {
          character.name = result.name;
          character.metric = result.metric;
          character.wowClass = result.wowClass;
          character.specialization = result.specialization;
          this.storeCharacters();
        }
      });
  }

  private loadCharacterGearSets(): void {
    const character: Character = this.myCharacters[this.selectedCharacterIndex];
    if (!character) {
      return;
    }
    this.specializationService
      .getBis(new Specialization(character.specialization))
      .pipe(finalize(() => (this.gearSetsLoading = false)))
      .subscribe((sets) => {
        this.compareSets = sets;
        this.selectedSet = this.compareSets[0];
      });
  }

  private setSelectedCharacter(characterIndex: number) {
    this.selectedCharacterIndex = characterIndex;
  }

  private loadCharacters(): void {
    const storedCharacters = this.localStorageService.get('myCharacters', 'characterList');
    this.myCharacters = storedCharacters
      ? storedCharacters.map((storedCharacter: IStoredCharacter) => new Character(storedCharacter))
      : [];
    this.loadCharacterGearSets();
  }

  private storeCharacters(): void {
    const storedCharacters: IStoredCharacter[] = this.myCharacters.map((character) => {
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
}
