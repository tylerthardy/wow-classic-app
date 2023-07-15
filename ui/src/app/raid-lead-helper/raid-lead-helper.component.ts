import { Component, OnInit, ViewChild } from '@angular/core';
import { Instances } from 'classic-companion-core';
import { SimpleModalService } from 'ngx-simple-modal';
import { CardComponent } from '../common/components/card/card.component';
import { ConfirmModalComponent } from '../common/components/confirm-modal/confirm-modal.component';
import { InstanceSizeSelection } from '../common/components/instance-size-selection/instance-size-selection';
import { ItemData } from '../common/item-data.interface';
import { Raid } from '../common/services/raids/raid.interface';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ToastService } from '../common/services/toast/toast.service';
import { PlayerLookupComponent } from '../player-lookup/player-lookup.component';
import { RaidInformationButton } from '../raid-information/raid-information.component';
import { RaidLookupComponent } from '../raid-lookup/raid-lookup.component';
import { RaidSpamComponent } from '../raid-spam/raid-spam.component';
import { SoftresManagerComponent } from '../softres-manager/softres-manager.component';

@Component({
  selector: 'app-raid-lead-helper',
  templateUrl: './raid-lead-helper.component.html',
  styleUrls: ['./raid-lead-helper.component.scss']
})
export class RaidLeadHelperComponent implements OnInit {
  private debug: boolean = false;

  @ViewChild('raidSpamCard') raidSpamCardRef!: CardComponent;
  @ViewChild('playerLookupCard') playerLookupCardRef!: CardComponent;
  @ViewChild('raidLookupCard') raidLookupCardRef!: CardComponent;
  @ViewChild('softresManagerCard') softresManagerCardRef!: CardComponent;

  @ViewChild('raidSpam') raidSpamRef!: RaidSpamComponent;
  @ViewChild('playerLookup') playerLookupRef!: PlayerLookupComponent;
  @ViewChild('raidLookup') raidLookupRef!: RaidLookupComponent;
  @ViewChild('softresManager') softresManagerRef!: SoftresManagerComponent;

  public instanceSizeSelection: InstanceSizeSelection = new InstanceSizeSelection({
    instance: Instances.ToGC,
    sizes: [25]
  });
  public raid: Raid | undefined;
  public detailsButtons: RaidInformationButton[];
  public isRecopyAfterPaste: boolean = true;
  public isStoreBeforeCopy: boolean = true;

  public instanceInput: SoftresRaidSlug = 'wotlknaxx10p2';
  public hardReserveItemInput: ItemData | undefined;
  public hardReserveRecipientInput: string | undefined;
  public softReserveCountInput: number = 1;

  public raidSpamInput?: Raid;
  public softresManagerInput?: Raid;
  public playerLookupInput?: InstanceSizeSelection; // FIXME: Do we need these separate ones? Or just the one parent (i think parent only)
  public raidLookupInput?: InstanceSizeSelection; // FIXME: Do we need these separate ones? Or just the one parent (i think parent only)

  constructor(private toast: ToastService, simpleModalService: SimpleModalService) {
    this.detailsButtons = [
      {
        label: '📝',
        click: () => {}
      },
      {
        label: '❌',
        click: () => {
          simpleModalService
            .addModal(ConfirmModalComponent, {
              title: 'Clear Current Raid',
              message: 'Are you sure you want to clear the current raid?'
            })
            .subscribe((result: boolean) => {
              if (result) {
                this.raid = undefined;
              }
            });
        }
      }
    ];
  }

  ngOnInit(): void {}

  public onCreateRaidClick(): void {
    //TODO: Use forms
    const params: Partial<Raid> = {
      instanceSizeSelection: this.instanceSizeSelection,
      hardReserveItem: this.hardReserveItemInput,
      hardReserveRecipient: this.hardReserveRecipientInput,
      softReserveCount: this.softReserveCountInput
    };

    const errors: string[] = this.getFormErrors(params);
    if (errors.length > 0) {
      this.toast.warn('Form data not valid', errors.map((error) => '- ' + error).join('\n'));
      return;
    }

    this.raid = {
      instanceSizeSelection: params.instanceSizeSelection!,
      hardReserveItem: params.hardReserveItem,
      hardReserveRecipient: params.hardReserveRecipient,
      softReserveCount: params.softReserveCount
    };

    // Duplicate inputs due to protect this.raid from modified properties
    // FIXME: Switched over to instanceSizeSelection; check to see if the bug exists where properties get modified,
    // FIXME: if so, use the commented lines
    // TODO: Separate these concepts. Too much
    this.raidSpamInput = {
      ...this.raid,
      // instanceSizeSelection: this.raid.instanceSizeSelection
      instanceSizeSelection: new InstanceSizeSelection({ ...this.raid.instanceSizeSelection })
    };
    this.softresManagerInput = {
      ...this.raid,
      // instanceSizeSelection: this.raid.instanceSizeSelection
      instanceSizeSelection: new InstanceSizeSelection({ ...this.raid.instanceSizeSelection })
    };
    // this.playerLookupInput = this.raid.instanceSizeSelection; // FIXME: Why are we accessing off of this.raid?
    this.playerLookupInput = new InstanceSizeSelection({ ...this.raid.instanceSizeSelection });
    // this.raidLookupInput = this.raid.instanceSizeSelection;
    this.raidLookupInput = new InstanceSizeSelection({ ...this.raid.instanceSizeSelection });
  }

  public onCheckPlayerClick(): void {
    navigator.clipboard.readText().then((result) => {
      this.playerLookupRef.searchPlayer(result);
      if (this.isRecopyAfterPaste) {
        this.copyRaidSpam();
      }
    });
  }
  public onCheckRaidClick(): void {
    navigator.clipboard.readText().then((result) => {
      this.raidLookupRef.searchRaid(result);
      if (this.isRecopyAfterPaste) {
        this.copyRaidSpam();
      }
    });
  }
  public onCopySpamClick(): void {
    this.copyRaidSpam();
  }
  public onCreateSoftresClick(): void {
    this.softresManagerRef.create();
  }
  public onCopySoftresClick(): void {
    if (this.isStoreBeforeCopy) {
      this.onStoreClipboard();
    }
    this.softresManagerRef.copyOutput();
  }
  public onStoreClipboard(): void {
    navigator.clipboard.readText().then((result) => {
      this.raidSpamRef.setCustomMessage(result);
    });
  }
  public onToggleRecopyAfterPaste(): void {
    this.isRecopyAfterPaste = !this.isRecopyAfterPaste;
  }
  public onToggleStoreBeforeCopy(): void {
    this.isStoreBeforeCopy = !this.isStoreBeforeCopy;
  }
  public onRaidCharacterNameClicked(characterName: string): void {
    this.playerLookupRef.searchPlayer(characterName);
    document.getElementById('player-lookup-card')?.scrollIntoView();
  }

  private copyRaidSpam(): void {
    try {
      this.raidSpamRef.copyOutput();
    } catch (err) {
      this.toast.error('Error', JSON.stringify(err));
    }
    this.toast.info('Copied!', 'Raid spam copied to clipboard');
  }

  // TODO: Copied from create-softres-modal -- use validators
  private getFormErrors(params: Partial<Raid>): string[] {
    const errors: string[] = [];
    if (!params.instanceSizeSelection?.hasSize()) {
      errors.push('A raid & size must be selected');
    }
    if (params.hardReserveItem && !params.hardReserveRecipient) {
      errors.push('A recipient must be specified for the hard-reserved item');
    }
    if (!params.hardReserveItem && params.hardReserveRecipient) {
      errors.push('A hard-reserved item must be specified for the recipient');
    }
    return errors;
  }
}
