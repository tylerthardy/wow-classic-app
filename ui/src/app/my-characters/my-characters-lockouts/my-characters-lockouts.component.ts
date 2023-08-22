import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Raid, Raids } from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { ColumnSpecification } from '../../common/components/grid/grid.component';
import { ToastService } from '../../common/services/toast/toast.service';
import { AppConfig } from '../../config/app.config';
import { IEditLockoutModalInput } from './edit-lockout-modal/edit-lockout-modal-input.interface';
import { IEditLockoutModalOutput } from './edit-lockout-modal/edit-lockout-modal-output.interface';
import { EditLockoutModalComponent } from './edit-lockout-modal/edit-lockout-modal.component';
import {
  CharacterLockoutsViewModel,
  MyCharactersLockoutsViewModel,
  RaidColumnData
} from './my-characters-lockouts.viewmodel';
import { INitImport } from './nit-import.interface';

const exampleData = {
  version: '0.1',
  lockouts: {
    Muerterter: [
      {
        locked: true,
        resetTime: 1692629999,
        name: 'Violet Hold',
        difficultyName: 'Heroic'
      },
      {
        locked: true,
        resetTime: 1692716399,
        name: "Onyxia's Lair",
        difficultyName: '25 Player'
      },
      {
        locked: true,
        resetTime: 1692716399,
        name: 'Vault of Archavon',
        difficultyName: '25 Player'
      },
      {
        locked: true,
        resetTime: 1692716399,
        name: 'Trial of the Crusader',
        difficultyName: '10 Player (Heroic)'
      },
      {
        locked: true,
        resetTime: 1692716399,
        name: 'Ulduar',
        difficultyName: '10 Player'
      },
      {
        locked: true,
        resetTime: 1692629999,
        name: "Ahn'kahet: The Old Kingdom",
        difficultyName: 'Heroic'
      }
    ],
    Pert: [],
    Werterter: [
      {
        locked: true,
        name: 'Trial of the Crusader',
        resetTime: 1692716402,
        difficultyName: '10 Player (Heroic)'
      }
    ],
    Merterter: [
      {
        locked: true,
        name: 'Vault of Archavon',
        resetTime: 1692716435,
        difficultyName: '25 Player'
      },
      {
        locked: true,
        name: 'Trial of the Crusader',
        resetTime: 1692716435,
        difficultyName: '25 Player'
      },
      {
        locked: true,
        name: 'Vault of Archavon',
        resetTime: 1692716435,
        difficultyName: '10 Player'
      }
    ],
    Rerterter: [],
    Herterter: [],
    Perterter: [
      {
        locked: true,
        resetTime: 1692716871,
        name: 'Trial of the Crusader',
        difficultyName: '25 Player (Heroic)'
      },
      {
        locked: true,
        resetTime: 1692716871,
        name: 'Trial of the Crusader',
        difficultyName: '10 Player (Heroic)'
      },
      {
        locked: true,
        resetTime: 1692716871,
        name: 'Vault of Archavon',
        difficultyName: '25 Player'
      }
    ],
    Paladerter: [],
    Sherterter: [
      {
        locked: true,
        resetTime: 1692716452,
        name: 'Trial of the Crusader',
        difficultyName: '25 Player (Heroic)'
      },
      {
        locked: true,
        resetTime: 1692716452,
        name: 'Trial of the Crusader',
        difficultyName: '10 Player (Heroic)'
      },
      {
        locked: true,
        resetTime: 1692716452,
        name: 'Vault of Archavon',
        difficultyName: '25 Player'
      },
      {
        locked: true,
        resetTime: 1692716452,
        name: 'Vault of Archavon',
        difficultyName: '10 Player'
      }
    ],
    Bankerter: [],
    Sugondeezy: [],
    Sharterter: [],
    Sperticus: [
      {
        locked: true,
        resetTime: 1692716742,
        name: 'Vault of Archavon',
        difficultyName: '25 Player'
      },
      {
        locked: true,
        resetTime: 1692716742,
        name: 'Vault of Archavon',
        difficultyName: '10 Player'
      }
    ]
  }
};

@Component({
  selector: 'app-my-characters-lockouts',
  templateUrl: './my-characters-lockouts.component.html',
  styleUrls: ['./my-characters-lockouts.component.scss']
})
export class MyCharactersLockoutsComponent implements OnInit {
  @ViewChild('playerNameTemplate', { static: true }) playerNameTemplateRef!: TemplateRef<any>;
  @ViewChild('raidLockoutTemplate', { static: true }) raidLockoutTemplateRef!: TemplateRef<any>;
  public nitInput?: string = JSON.stringify(exampleData);
  public viewModel: MyCharactersLockoutsViewModel | undefined;
  public columns!: ColumnSpecification<CharacterLockoutsViewModel>[];
  public isLoading: boolean = false;

  constructor(
    private toastService: ToastService,
    private simpleModalService: SimpleModalService,
    private config: AppConfig
  ) {}

  ngOnInit(): void {
    this.columns = this.getColumns();
  }

  public onToggleHiddenClick(): void {
    if (!this.viewModel) {
      return;
    }
    this.viewModel.showHidden = !this.viewModel.showHidden;
  }

  public onImportClick(): void {
    let nitImport: INitImport;
    try {
      nitImport = JSON.parse(this.nitInput!);
    } catch (err) {
      this.toastService.warn(
        'Invalid Data',
        'The data on clipboard is not valid json. Copy from the addon and try again.'
      );
      return;
    }

    if (nitImport.version !== this.config.addonVersion) {
      this.toastService.warn(
        'Outdated Addon',
        'Get the latest version of the addon from the "Download Addon" button at the top of the page.'
      );
      return;
    }

    this.viewModel = new MyCharactersLockoutsViewModel(nitImport.lockouts);
  }

  public onHiddenToggleClick(character: CharacterLockoutsViewModel): void {
    character.hidden = !character.hidden;
  }

  public onRaidLockoutClick(raidColumns: Map<Raid, RaidColumnData>, raid: Raid): void {
    const raidData: RaidColumnData | undefined = raidColumns.get(raid);
    if (!raidData) {
      throw new Error('raid lockout not found ' + JSON.stringify(raid));
    }
    const data: IEditLockoutModalInput = {
      scheduledDay: raidData.scheduledDay,
      scheduledTime: raidData.scheduledTime,
      needsToRun: raidData.needsToRun,
      completed: raidData.completed
    };
    this.simpleModalService.addModal(EditLockoutModalComponent, data).subscribe((result: IEditLockoutModalOutput) => {
      if (result) {
        raidData.scheduledDay = result.scheduledDay;
        raidData.scheduledTime = result.scheduledTime;
        raidData.needsToRun = result.needsToRun;
        raidData.completed = result.completed;
      }
    });
  }

  private getRaidCellStyle(rowValue: CharacterLockoutsViewModel, raid: Raid): { [key: string]: any } {
    const raidData: RaidColumnData | undefined = rowValue.raidColumns.get(raid);
    if (!raidData) {
      throw new Error('raid lockout not found ' + JSON.stringify(raid));
    }
    if (!raidData.needsToRun) {
      return { 'background-color': '#222222' };
    }
    if (raidData.completed) {
      return { 'background-color': '#134d00' };
    } else {
      return { 'background-color': '#5e3703' };
    }
  }

  private getColumns(): ColumnSpecification<CharacterLockoutsViewModel>[] {
    const columnStyle = { width: '160px' };
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
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Onyxia10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Onyxia10),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.Onyxia10),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      },
      {
        label: 'Ony25',
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Onyxia25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Onyxia25),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.Onyxia25),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      },
      {
        label: 'VoA10',
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.VoA10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.VoA10),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.VoA10),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      },
      {
        label: 'VoA25',
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.VoA25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.VoA25),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.VoA25),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      },
      {
        label: 'Uld10',
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Ulduar10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Ulduar10),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.Ulduar10),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      },
      {
        label: 'Uld25',
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.Ulduar25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.Ulduar25),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.Ulduar25),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      },
      {
        label: 'ToGC10',
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.ToGC10),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.ToGC10),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.ToGC10),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      },
      {
        label: 'ToGC25',
        valueKey: 'raidColumns',
        cellStyle: (rowValue) => this.getRaidCellStyle(rowValue, Raids.ToGC25),
        onClick: (rowValue) => this.onRaidLockoutClick(rowValue, Raids.ToGC25),
        columnStyle,
        transform: (rowValue) => rowValue.raidColumns.get(Raids.ToGC25),
        format: {
          type: 'template',
          template: this.raidLockoutTemplateRef
        }
      }
    ];
  }
}
