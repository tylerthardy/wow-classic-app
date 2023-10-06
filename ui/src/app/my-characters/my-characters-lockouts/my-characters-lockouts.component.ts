import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Raid, Raids } from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { ColumnSpecification } from '../../common/components/grid/grid.component';
import { LocalStorageService } from '../../common/services/local-storage.service';
import { ToastService } from '../../common/services/toast/toast.service';
import { AppConfig } from '../../config/app.config';
import { Character } from '../character';
import { MyCharactersService } from '../my-characters.service';
import { IEditLockoutModalInput } from './edit-lockout-modal/edit-lockout-modal-input.interface';
import { IEditLockoutModalOutput } from './edit-lockout-modal/edit-lockout-modal-output.interface';
import { EditLockoutModalComponent } from './edit-lockout-modal/edit-lockout-modal.component';
import { CharacterRaidStatus } from './models/character-raid-status.model';
import { INitImport, NitImport } from './models/imports/nit-import.interface';

@Component({
  selector: 'app-my-characters-lockouts',
  templateUrl: './my-characters-lockouts.component.html',
  styleUrls: ['./my-characters-lockouts.component.scss']
})
export class MyCharactersLockoutsComponent implements OnInit {
  @ViewChild('playerNameTemplate', { static: true }) playerNameTemplateRef!: TemplateRef<any>;
  @ViewChild('raidStatusTemplate', { static: true }) raidStatusTemplateRef!: TemplateRef<any>;
  public nitInput?: string;
  public columns!: ColumnSpecification<Character>[];
  public showHidden: boolean = true;
  public test = true;

  constructor(
    public myCharactersService: MyCharactersService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private simpleModalService: SimpleModalService,
    private config: AppConfig,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const showHidden: boolean | undefined = this.localStorageService.get('my-characters-lockouts', 'show-hidden');
    this.showHidden = showHidden !== undefined ? showHidden : true;
    this.columns = this.getColumns();
  }

  public onToggleHiddenClick(): void {
    this.showHidden = !this.showHidden;
    this.save();
  }

  public save(): void {
    this.localStorageService.store('my-characters-lockouts', 'show-hidden', this.showHidden);
    this.myCharactersService.save();
  }

  public onImportClick(): void {
    let nitImportData: INitImport;
    try {
      nitImportData = JSON.parse(this.nitInput!);
    } catch (err) {
      this.toastService.warn(
        'Invalid Data',
        'The data on clipboard is not valid json. Copy from the addon and try again.'
      );
      return;
    }

    if (nitImportData.version !== this.config.addonVersion) {
      this.toastService.warn(
        'Outdated Addon',
        'Get the latest version of the addon from the "Download Addon" button at the top of the page.'
      );
      return;
    }

    const nitImport: NitImport = new NitImport(nitImportData);
    this.myCharactersService.patchNitImport(nitImport);
    // this.test = false;
    // FIXME: THIS IS STILL NOT WORKING
    // this.cdr.markForCheck();
    // this.cdr.detectChanges();
  }

  public onHiddenToggleClick(character: Character): void {
    // character.hidden = !character.hidden;
    // this.save();
    // TODO: This
    this.toastService.warn('Cannot Hide', 'Feature temporarily disabled');
  }

  public onAddClick(): void {
    const characterName = prompt('Enter character name');

    if (characterName != null) {
      const newCharacter: Character = new Character({
        name: characterName,
        className: 'PALADIN',
        metric: 'dps',
        gear: { items: [] }
      });
      try {
        this.myCharactersService.add(newCharacter);
        this.save();
      } catch (error) {
        this.toastService.error('Add Character Failed', error);
      }
    }
  }

  public onDeleteClick(): void {
    const characterName: string | null = prompt('Enter character name to delete');
    if (!characterName) {
      return;
    }
    const characterToDelete: Character | undefined = this.myCharactersService.get(characterName);
    if (!characterToDelete) {
      this.toastService.warn('Cannot delete Character', 'Character not found ' + characterName);
      return;
    }
    this.myCharactersService.delete(characterName);
    this.save();
  }

  public onRaidLockoutClick(raidStatuses: CharacterRaidStatus[], raid: Raid): void {
    // TODO: Performance; ideally the grid should pass the row value (character object) instead of the cell value
    const raidData: CharacterRaidStatus | undefined = raidStatuses.find((raidStatus) => raidStatus.raid === raid);
    if (!raidData) {
      throw new Error('raid lockout not found ' + JSON.stringify(raid));
    }
    const data: IEditLockoutModalInput = {
      scheduledDay: raidData.scheduledDay,
      scheduledTime: raidData.scheduledTime,
      notes: raidData.notes,
      needsToRun: raidData.needsToRun,
      completed: raidData.completed
    };
    this.simpleModalService.addModal(EditLockoutModalComponent, data).subscribe((result: IEditLockoutModalOutput) => {
      if (result) {
        raidData.scheduledDay = result.scheduledDay;
        raidData.scheduledTime = result.scheduledTime;
        raidData.notes = result.notes;
        raidData.needsToRun = result.needsToRun ?? false;
        raidData.manuallyCompletedOn = result.completed === true ? Date.now() : -1;
        this.save();
      }
    });
  }

  private getRaidCellStyle(rowValue: Character, raid: Raid): { [key: string]: any } {
    const raidData: CharacterRaidStatus | undefined = rowValue.getRaidStatus(raid);
    let backgroundColor: string;
    if (!raidData) {
      throw new Error('raid lockout not found ' + JSON.stringify(raid));
    }
    if (raidData.completed) {
      backgroundColor = '#c6e0b4';
    } else if (raidData.scheduledDay || raidData.scheduledTime) {
      backgroundColor = '#fff2cc';
    } else if (!raidData.needsToRun) {
      backgroundColor = '#808080';
    } else {
      backgroundColor = '#f8cbad';
    }
    return { 'background-color': backgroundColor };
  }

  private getColumns(): ColumnSpecification<Character>[] {
    const columnStyle = {};
    return [
      {
        label: 'Name',
        valueKey: 'name',
        format: {
          type: 'template',
          template: this.playerNameTemplateRef
        }
      },
      {
        label: 'Ony10',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Onyxia10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Onyxia10),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.Onyxia10),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      },
      {
        label: 'Ony25',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Onyxia25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Onyxia25),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.Onyxia25),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      },
      {
        label: 'VoA10',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.VoA10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.VoA10),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.VoA10),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      },
      {
        label: 'VoA25',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.VoA25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.VoA25),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.VoA25),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      },
      {
        label: 'Uld10',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Ulduar10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Ulduar10),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.Ulduar10),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      },
      {
        label: 'Uld25',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Ulduar25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Ulduar25),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.Ulduar25),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      },
      {
        label: 'ToGC10',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.ToGC10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.ToGC10),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.ToGC10),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      },
      {
        label: 'ToGC25',
        valueKey: 'raidStatuses',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.ToGC25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.ToGC25),
        columnStyle,
        transform: (rowValue) => rowValue.getRaidStatus(Raids.ToGC25),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      }
    ];
  }
}
