import { Component, Input, OnInit } from '@angular/core';
import { RaidData } from '../common/services/raids/raid-data.interface';
import { Raid } from '../common/services/raids/raid.interface';
import { raids } from '../common/services/raids/raids';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ToastService } from '../common/services/toast/toast.service';
import { MathUtil } from '../common/utils';
import { HtmlCopyUtil } from '../common/utils/html-copy-util';

@Component({
  selector: 'app-raid-spam',
  templateUrl: './raid-spam.component.html',
  styleUrls: ['./raid-spam.component.scss']
})
export class RaidSpamComponent implements OnInit {
  @Input() raid: Partial<Raid> = {};
  @Input() hideRaidInputFields: boolean = false;
  public useCustomMessage: boolean = false;
  public customMessage: string | undefined;
  uniqueId = MathUtil.generateUUID();

  constructor(private toast: ToastService) {}

  ngOnInit(): void {}

  get spamOutput(): string | undefined {
    if (!this.raid.raidAndSize || !this.raid.softReserveCount) {
      return undefined;
    }

    const raidSlug: SoftresRaidSlug | undefined = this.raid.raidAndSize.getSoftResSlug();
    if (!raidSlug) {
      return undefined;
    }

    // FIXME: Raid enum refactor
    const instanceData: RaidData | undefined = raids.find((raid) => raid.softresSlug === raidSlug);
    if (!instanceData) {
      throw new Error('raid not found ' + raidSlug);
    }

    // FIXME: Raid enum refactor
    const lfgRaidName: string = instanceData.name.replace(' ', '');
    const hardReserveText: string = this.raid.hardReserveItem
      ? `, ${this.raid.hardReserveItem.name} HR`
      : ', Nothing HR';

    return `LFM ${lfgRaidName} -- ${this.raid.softReserveCount}SR${hardReserveText} -- PST w GS`;
  }

  public onCopyClick(): void {
    try {
      this.copyOutput();
    } catch (err) {
      console.error(err);
      this.toast.error('Error', err);
      return;
    }
    this.toast.info('Copied!', 'Raid spam copied to clipboard');
  }

  public onCustomMessageCheckboxChange(event: any): void {
    if (!event.target) return;
    let element: HTMLInputElement = event.target as HTMLInputElement;
    this.useCustomMessage = element.checked;
  }

  public copyOutput(): void {
    if (this.useCustomMessage) {
      HtmlCopyUtil.copyInputValueById('custom-message-' + this.uniqueId);
    } else {
      HtmlCopyUtil.copyInputValueById('generated-message-' + this.uniqueId);
    }
  }

  public setCustomMessage(message: string): void {
    this.useCustomMessage = true;
    this.customMessage = message;
  }
}
