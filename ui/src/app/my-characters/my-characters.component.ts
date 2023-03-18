import { Component } from '@angular/core';
import {
  IWowSimsExport,
  IWowSimsExportItem,
  Specialization,
  WowClass,
  WOWSIMS_EXPORT_SLOTS
} from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { allItemsById } from '../all-items-by-id';
import { ItemData } from '../common/item-data.interface';
import { LocalStorageService } from '../common/services/local-storage.service';
import { ToastService } from '../common/services/toast/toast.service';
import { SpecializationService } from '../common/specialization/specialization.service';
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
  public compareSetsNames: string[] = [];
  public slotItemMetadata: { [slot: number]: ItemData | undefined } = {};
  public wseInput?: string;
  public selectedCharacterIndex: number = 0;
  public SLOT_INDICES: number[] = Array.from(Array(17), (_, i) => i);
  public myCharacters: Character[] = [];

  get selectedSet(): IWowSimsExport | undefined {
    return this._selectedSet;
  }
  set selectedSet(value: IWowSimsExport | undefined) {
    this._selectedSet = value;
    this.slotItemMetadata = this.getSetSlotMetadata(value);
  }
  private _selectedSet?: IWowSimsExport;

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
        wowClass: WowClass.getClassByName(wowSimsImport.class)
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

  public hasItem(slot: number): boolean {
    // FIXME: "myGear" could be a class. Would clean up a lot of this logic all around
    const myGear: {
      items: (IWowSimsExportItem | null)[];
    } = this.myCharacters[this.selectedCharacterIndex].gear;
    const myItem: IWowSimsExportItem | null | undefined = myGear.items[slot];
    const targetItem: IWowSimsExportItem | null | undefined = this.selectedSet?.gear.items[slot];
    if (!myItem || !targetItem) {
      return false;
    }
    if (slot === WOWSIMS_EXPORT_SLOTS.TRINKET1 || slot === WOWSIMS_EXPORT_SLOTS.TRINKET2) {
      return this.eitherItemMatchesTarget(
        targetItem,
        myGear.items[WOWSIMS_EXPORT_SLOTS.TRINKET1],
        myGear.items[WOWSIMS_EXPORT_SLOTS.TRINKET2]
      );
    }
    if (slot === WOWSIMS_EXPORT_SLOTS.FINGER1 || slot === WOWSIMS_EXPORT_SLOTS.FINGER2) {
      return this.eitherItemMatchesTarget(
        targetItem,
        myGear.items[WOWSIMS_EXPORT_SLOTS.FINGER1],
        myGear.items[WOWSIMS_EXPORT_SLOTS.FINGER2]
      );
    }

    return myItem.id === targetItem.id;
  }

  private loadCharacterGearSets(): void {
    const character: Character = this.myCharacters[this.selectedCharacterIndex];
    if (!character) {
      return;
    }
    this.specializationService.getBis(new Specialization(character.specialization)).subscribe((sets) => {
      this.compareSets = sets;
      this.compareSetsNames = Object.keys(sets);
      this.selectedSet = this.compareSets[0];
    });
  }

  private setSelectedCharacter(characterIndex: number) {
    this.selectedCharacterIndex = characterIndex;
  }

  private getSetSlotMetadata(set: IWowSimsExport | undefined): { [slot: number]: ItemData | undefined } {
    if (!set) {
      return {};
    }
    const metadata: { [slot: number]: ItemData | undefined } = {};
    set.gear.items.forEach((item, slot) => {
      if (!item || !item.id) {
        return;
      }
      metadata[slot] = this.getItemMetadata(item.id);
    });
    return metadata;
  }

  private getItemMetadata(id: number): ItemData | undefined {
    const foundItems: ItemData[] | undefined = allItemsById[id];
    if (!foundItems) {
      console.error('could not find item for id: ' + id);
      return undefined;
    }
    if (foundItems.length > 1) {
      console.warn(`${foundItems.length} items found for id ${id}, returning first`);
    }
    return foundItems[0];
  }

  private eitherItemMatchesTarget(
    targetItem: IWowSimsExportItem | null | undefined,
    myItem1: IWowSimsExportItem | null | undefined,
    myItem2: IWowSimsExportItem | null | undefined
  ): boolean {
    if (!targetItem) {
      return true;
    }
    return targetItem.id === myItem1?.id || targetItem.id === myItem2?.id;
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
