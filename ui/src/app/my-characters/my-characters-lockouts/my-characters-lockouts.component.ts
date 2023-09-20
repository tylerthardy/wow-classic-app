import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Raid, Raids } from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { ColumnSpecification } from '../../common/components/grid/grid.component';
import { LocalStorageService } from '../../common/services/local-storage.service';
import { ToastService } from '../../common/services/toast/toast.service';
import { AppConfig } from '../../config/app.config';
import { IEditLockoutModalInput } from './edit-lockout-modal/edit-lockout-modal-input.interface';
import { IEditLockoutModalOutput } from './edit-lockout-modal/edit-lockout-modal-output.interface';
import { EditLockoutModalComponent } from './edit-lockout-modal/edit-lockout-modal.component';
import { CharacterRaidStatus } from './models/character-raid-status.model';
import {
  IMyCharactersLockoutsSave,
  MyCharacterLockoutSaveLockout,
  MyCharactersLockoutsSave,
  MyCharactersLockoutsSaveCharacter
} from './models/imports/my-characters-lockouts-save.interface';
import { INitImport, NitImport } from './models/imports/nit-import.interface';
import { CharacterLockoutsViewModel } from './models/view-models/character-lockouts.viewmodel';
import { MyCharactersLockoutsViewModel } from './models/view-models/my-characters-lockouts.viewmodel';

@Component({
  selector: 'app-my-characters-lockouts',
  templateUrl: './my-characters-lockouts.component.html',
  styleUrls: ['./my-characters-lockouts.component.scss']
})
export class MyCharactersLockoutsComponent implements OnInit {
  @ViewChild('playerNameTemplate', { static: true }) playerNameTemplateRef!: TemplateRef<any>;
  @ViewChild('raidStatusTemplate', { static: true }) raidStatusTemplateRef!: TemplateRef<any>;
  public nitInput?: string;
  public viewModel: MyCharactersLockoutsViewModel | undefined;
  public columns!: ColumnSpecification<CharacterLockoutsViewModel>[];
  public isLoading: boolean = false;

  constructor(
    private toastService: ToastService,
    private simpleModalService: SimpleModalService,
    private localStorageService: LocalStorageService,
    private config: AppConfig
  ) {}

  ngOnInit(): void {
    this.columns = this.getColumns();
    this.loadSavedData();
  }

  public onToggleHiddenClick(): void {
    if (!this.viewModel) {
      return;
    }
    this.viewModel.showHidden = !this.viewModel.showHidden;
  }

  public loadSavedData(): void {
    const loadedSave: IMyCharactersLockoutsSave | undefined = this.localStorageService.get(
      'my-characters-lockouts',
      'lockouts'
    );
    if (!loadedSave) {
      return;
    }
    const save: MyCharactersLockoutsSave = new MyCharactersLockoutsSave({
      version: loadedSave.version,
      showHidden: loadedSave.showHidden,
      characters: loadedSave.characters.map((c) => {
        return new MyCharactersLockoutsSaveCharacter({
          characterName: c.characterName,
          classSlug: c.classSlug,
          hidden: c.hidden,
          lockouts: c.lockouts.map((l) => {
            return new MyCharacterLockoutSaveLockout(l);
          })
        });
      })
    });
    this.viewModel = new MyCharactersLockoutsViewModel(save);
    this.viewModel.showHidden = save.showHidden;
  }

  public saveLockouts(): void {
    this.localStorageService.store('my-characters-lockouts', 'lockouts', this.viewModel?.getSaveableData());
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
    if (!this.viewModel) {
      this.viewModel = new MyCharactersLockoutsViewModel(nitImport);
    } else {
      const viewModelToMerge: MyCharactersLockoutsViewModel = new MyCharactersLockoutsViewModel(nitImport);
      this.viewModel.patchData(viewModelToMerge);
    }
    this.saveLockouts();
  }

  public onHiddenToggleClick(character: CharacterLockoutsViewModel): void {
    character.hidden = !character.hidden;
    this.saveLockouts();
  }

  public onAddClick(): void {
    const characterName = prompt('Enter character name');

    if (characterName != null) {
      this.viewModel?.data.push(new CharacterLockoutsViewModel(characterName, undefined, []));
    }
  }

  public onDeleteClick(): void {
    if (!this.viewModel) {
      return;
    }
    const characterName: string | null = prompt('Enter character name to delete');
    if (!characterName) {
      return;
    }
    const toDeleteIndex: number = this.viewModel.data.findIndex(
      (characterLockouts) => characterLockouts.characterName.toLowerCase() === characterName.toLowerCase()
    );
    if (toDeleteIndex === -1) {
      this.toastService.warn('Cannot delete Character', 'Character not found ' + characterName);
      return;
    }
    this.viewModel.data.splice(toDeleteIndex, 1);
  }

  public onRaidLockoutClick(raidStatuses: Map<Raid, CharacterRaidStatus>, raid: Raid): void {
    const raidData: CharacterRaidStatus | undefined = raidStatuses.get(raid);
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
        this.saveLockouts();
      }
    });
  }

  private getRaidCellStyle(rowValue: CharacterLockoutsViewModel, raid: Raid): { [key: string]: any } {
    const raidData: CharacterRaidStatus | undefined = rowValue.raidStatuses.get(raid);
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

  private getColumns(): ColumnSpecification<CharacterLockoutsViewModel>[] {
    const columnStyle = {};
    return [
      {
        label: 'Name',
        valueKey: 'characterName',
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.Onyxia10),
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.Onyxia25),
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.VoA10),
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.VoA25),
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.Ulduar10),
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.Ulduar25),
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.ToGC10),
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
        transform: (rowValue) => rowValue.raidStatuses.get(Raids.ToGC25),
        format: {
          type: 'template',
          template: this.raidStatusTemplateRef
        }
      }
    ];
  }
}
