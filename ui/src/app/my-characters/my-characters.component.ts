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

@Component({
  selector: 'app-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss']
})
export class MyCharactersComponent {
  public compareSets?: IWowSimsExport[];
  public wseInput?: string;
  public selectedCharacter: Character | undefined;
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

  public onWseImported(wowSimsImport: IWowSimsExport): void {
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
            this.myCharacters.push(newCharacter);
            this.selectedCharacter = newCharacter;
            this.storeCharacters();
          }
        });
    }
  }

  public onCharacterClicked(selectedCharacter: Character) {
    this.selectedCharacter = selectedCharacter;
    console.log(this.selectedCharacter);
    this.loadCharacterGearSets(selectedCharacter);
  }

  public onDeleteCharacterClick(deletedCharacter: Character): void {
    const deletedIndex: number | undefined = this.myCharacters.findIndex((character) => character === deletedCharacter);
    if (!deletedIndex) {
      return;
    }
    this.myCharacters.splice(deletedIndex, 1);
    this.storeCharacters();
  }

  public onEditCharacterClick(character: Character): void {
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

  private loadCharacterGearSets(character: Character | undefined): void {
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

  private loadSelectedCharacterGearSets(): void {
    this.loadCharacterGearSets(this.selectedCharacter);
  }

  private loadCharacters(): void {
    const storedCharacters = this.localStorageService.get('myCharacters', 'characterList');
    this.myCharacters = storedCharacters
      ? storedCharacters.map((storedCharacter: IStoredCharacter) => new Character(storedCharacter))
      : [];
    this.selectedCharacter = this.myCharacters[0];
    this.loadSelectedCharacterGearSets();
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
