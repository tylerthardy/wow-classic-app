import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IWowSimsExport } from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { ToastService } from '../../common/services/toast/toast.service';
import { Character } from '../character';

@Component({
  selector: 'app-my-character-list',
  templateUrl: './my-character-list.component.html',
  styleUrls: ['./my-character-list.component.scss']
})
export class MyCharacterListComponent {
  @Input() public characters: Character[] = [];
  @Output() public selectedCharacterChanged: EventEmitter<Character> = new EventEmitter();
  @Output() public editCharacterClicked: EventEmitter<Character> = new EventEmitter();
  @Output() public deleteCharacterClicked: EventEmitter<Character> = new EventEmitter();
  @Output() public wseImported: EventEmitter<IWowSimsExport> = new EventEmitter();
  public wseInput?: string;
  public selectedCharacterIndex: number = 0;

  constructor(private toastService: ToastService, private simpleModalService: SimpleModalService) {}

  public onWseImportClick(): void {
    if (!this.wseInput) {
      this.toastService.warn('Invalid Import', 'Add value to the import'); // FIXME: Tone is all wrong
      return;
    }
    const wowSimsImport: IWowSimsExport = JSON.parse(this.wseInput);
    this.wseImported.emit(wowSimsImport);
  }

  public onSelectedCharacterChange(changeEvent: Event) {
    const character: Character | undefined = this.getCharacterFromRadioEvent(changeEvent);
    if (!character) {
      return;
    }
    console.log('selectedCharacterChanged.emit(character)', character);
    this.selectedCharacterChanged.emit(character);
  }

  public onDeleteCharacterClick(characterIndex: number): void {
    const character: Character | undefined = this.getCharacterFromIndex(characterIndex);
    if (!character) {
      return;
    }
    this.deleteCharacterClicked.emit(character);
  }

  public onEditCharacterClick(characterIndex: number): void {
    const character: Character | undefined = this.getCharacterFromIndex(characterIndex);
    if (!character) {
      return;
    }
    this.editCharacterClicked.emit(character);
  }

  private getCharacterFromIndex(index: number): Character | undefined {
    return this.characters[index];
  }

  private getCharacterFromRadioEvent(event: Event): Character | undefined {
    const inputTarget: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!inputTarget) {
      return;
    }
    const characterIndexValue: string | null = inputTarget.getAttribute('ng-reflect-value');
    if (characterIndexValue === null || characterIndexValue === undefined) {
      return;
    }
    const characterIndex: number = Number.parseInt(characterIndexValue);
    const character: Character | undefined = this.getCharacterFromIndex(characterIndex);
    return character;
  }
}
