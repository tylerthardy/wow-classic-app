import { Component } from '@angular/core';
import { IWowSimsExport, Specialization, WowClasses } from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { finalize } from 'rxjs';
import { SpecializationService } from '../common/services/specialization/specialization.service';
import { ToastService } from '../common/services/toast/toast.service';
import { Character } from './character';
import { IMyCharacterImportModalInput } from './my-character-import-modal/my-character-import-modal-input.interface';
import { IMyCharacterImportModalOutput } from './my-character-import-modal/my-character-import-modal-output.interface';
import { MyCharacterImportModalComponent } from './my-character-import-modal/my-character-import-modal.component';
import { MyCharactersService } from './my-characters.service';

@Component({
  selector: 'app-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss']
})
export class MyCharactersComponent {
  public compareSets?: IWowSimsExport[];
  public wseInput?: string;
  public selectedCharacter: Character | undefined;
  public selectedSet?: IWowSimsExport;
  public gearSetsLoading: boolean = false;

  constructor(
    public myCharactersService: MyCharactersService,
    private toastService: ToastService,
    private specializationService: SpecializationService,
    private simpleModalService: SimpleModalService
  ) {
    this.myCharactersService.loadCharacters();
    this.selectedCharacter = this.myCharactersService.characters[0];
    this.loadSelectedCharacterGearSets();
  }

  public onWseImported(wowSimsImport: IWowSimsExport): void {
    let matchedCharacter: Character | undefined = this.myCharactersService.characters.find(
      (c) => c.name.toLowerCase() === wowSimsImport.name.toLowerCase()
    );
    if (matchedCharacter) {
      matchedCharacter.gear = wowSimsImport.gear;
      this.toastService.info('Character Updated', 'Imported data to existing character');
      this.myCharactersService.saveCharacters();
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
            this.myCharactersService.characters.push(newCharacter);
            this.selectedCharacter = newCharacter;
            this.myCharactersService.saveCharacters();
          }
        });
    }
  }

  public onCharacterClicked(selectedCharacter: Character) {
    this.selectedCharacter = selectedCharacter;
    this.loadSelectedCharacterGearSets();
  }

  public onDeleteCharacterClick(deletedCharacter: Character): void {
    const deletedIndex: number | undefined = this.myCharactersService.characters.findIndex(
      (character) => character === deletedCharacter
    );
    if (!deletedIndex) {
      return;
    }
    this.myCharactersService.characters.splice(deletedIndex, 1);
    this.myCharactersService.saveCharacters();
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
          this.myCharactersService.saveCharacters();
        }
      });
  }

  private loadCharacterGearSets(character: Character | undefined): void {
    if (!character) {
      return;
    }
    if (!character.specialization) {
      this.toastService.warn('Cannot Display Gear', 'No specialization set for character, cannot display gear sets.');
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
}
