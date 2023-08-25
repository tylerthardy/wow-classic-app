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
  @Input() public selectedCharacter: Character | undefined;
  @Output() public characterClicked: EventEmitter<Character> = new EventEmitter();
  @Output() public editCharacterClicked: EventEmitter<Character> = new EventEmitter();
  @Output() public deleteCharacterClicked: EventEmitter<Character> = new EventEmitter();
  @Output() public wseImported: EventEmitter<IWowSimsExport> = new EventEmitter();
  public wseInput?: string;

  constructor(private toastService: ToastService, private simpleModalService: SimpleModalService) {}

  public onWseImportClick(): void {
    if (!this.wseInput) {
      return;
    }
    const wowSimsImport: IWowSimsExport = JSON.parse(this.wseInput);
    this.wseImported.emit(wowSimsImport);
  }

  public onCharacterClick(characterIndex: number, event: MouseEvent): void {
    this.selectedCharacter = this.characters[characterIndex];
    this.characterClicked.emit(this.selectedCharacter);
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
}
