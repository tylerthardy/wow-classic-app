import { Component, Input, OnInit } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../common/components/confirm-modal/confirm-modal.component';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-and-size-selection';
import { Raid } from '../common/services/raids/raid.interface';
import { Softres } from '../common/services/softres/http/common/softres.interface';
import { CreateSoftresResponse } from '../common/services/softres/http/create-softres-response.interface';
import { CreateSoftresOptions } from '../common/services/softres/options/create-softres-options.interface';
import { CreateSoftresWithHardReserveOptions } from '../common/services/softres/options/create-softres-with-hard-reserve-options.interface';
import { SoftresService } from '../common/services/softres/softres.service';
import { ToastService } from '../common/services/toast.service';
import { HtmlCopyUtil } from '../common/utils/html-copy-util';
import { CreateSoftresModalData } from '../create-softres-modal/create-softres-modal-data.interface';
import { CreateSoftresModalComponent } from '../create-softres-modal/create-softres-modal.component';

@Component({
  selector: 'app-softres-manager',
  templateUrl: './softres-manager.component.html',
  styleUrls: ['./softres-manager.component.scss']
})
export class SoftresManagerComponent implements OnInit {
  private debug = false;

  @Input() raid?: Raid;

  public softres: Softres | undefined = this.debug
    ? JSON.parse(
        '{"raidId":"po8p78","edition":"wotlk","instance":"obsidiansanctum10p2","discord":true,"discordId":null,"discordInvite":null,"token":"direwing809","reserved":[],"modifications":0,"faction":"Alliance","amount":1,"lock":false,"note":"","raidDate":null,"lockRaidDate":false,"hideReserves":false,"allowDuplicate":true,"itemLimit":0,"plusModifier":1,"plusType":0,"restrictByClass":true,"characterNotes":true,"itemNotes":[],"date":"2023-01-27T16:15:21.478Z","updated":"2023-01-27T16:15:21.478Z","_id":"63d3f899f13fcda11edcd847"}'
      )
    : undefined;
  public showEmbedded: boolean = true;

  get softResUrl(): string {
    if (!this.softres) {
      throw new Error('no softres');
    }
    return `https://softres.it/raid/${this.softres.raidId}`;
  }

  constructor(
    private softresService: SoftresService,
    private simpleModalService: SimpleModalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {}

  onToggleEmbeddedClick(): void {
    this.showEmbedded = !this.showEmbedded;
  }

  onHardResClick(): void {
    this.softresService
      .hardReserve({
        hardReserves: [
          {
            itemId: 40431,
            recipient: 'Perterter',
            reserved: true
          }
        ],
        raidId: this.softres!.raidId,
        token: this.softres!.token!
      })
      .subscribe((result) => {
        console.log('hard-res result', result);
      });
  }

  onClearSoftResClick(): void {
    this.simpleModalService
      .addModal(ConfirmModalComponent, {
        title: 'Clear Current Softres',
        message: 'Are you sure you want to clear the current Softres loaded into the raid helper?'
      })
      .subscribe((result: boolean) => {
        if (result) {
          this.softres = undefined;
        }
      });
  }

  public onCopyClick(): void {
    try {
      this.copyOutput();
    } catch (err) {
      console.error(err);
      this.toast.error('Error', err);
      return;
    }
    this.toast.info('Copied!', 'Softres URL copied to clipboard');
  }

  public copyOutput(): void {
    HtmlCopyUtil.copyInputValueById('softres-url');
  }

  onCreateSoftResClick(): void {
    this.create();
  }

  create(): void {
    if (this.softres) {
      alert('Cannot create softres. One already exists.');
      return;
    }
    const data: CreateSoftresModalData = {
      raidAndSize: new RaidAndSizeSelection({
        raid: 'ulduar',
        size10: true
      }),
      softReserveCount: 1,
      ...this.raid
    };

    this.simpleModalService.addModal(CreateSoftresModalComponent, data).subscribe((result: CreateSoftresModalData) => {
      if (result) {
        this.createSoftres(result).subscribe((result) => (this.softres = result));
      }
    });
  }

  getSoftresUrl(): string {
    if (!this.softres) {
      throw new Error('no softres set');
    }
    const url: string = `https://softres.it/raid/${this.softres.raidId}?token=${this.softres.token}`;
    return url;
  }

  private createSoftres(modalData: CreateSoftresModalData): Observable<CreateSoftresResponse> {
    let createOptions: CreateSoftresOptions = {
      edition: 'wotlk',
      instance: modalData.raidAndSize.getSoftResSlug()!,
      faction: 'Alliance',
      discord: true,
      amount: 1,
      itemLimit: 0,
      hideReserves: false,
      plusModifier: 1,
      characterNotes: true,
      restrictByClass: true,
      allowDuplicate: true
    };

    if (modalData.hardReserveRecipient && modalData.hardReserveItem) {
      const createWithHardReserveOptions: CreateSoftresWithHardReserveOptions = {
        ...createOptions,
        hardReserveItem: modalData.hardReserveItem,
        hardReserveRecipient: modalData.hardReserveRecipient
      };
      return this.softresService.createWithHardReserve(createWithHardReserveOptions);
    } else {
      return this.softresService.create(createOptions);
    }
  }
}
