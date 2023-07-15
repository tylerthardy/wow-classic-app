import { Component, Input, OnInit } from '@angular/core';
import { Raid } from '../common/services/raids/raid.interface';
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
    if (!this.raid.instanceSizeSelection || !this.raid.softReserveCount) {
      return undefined;
    }

    const lfgRaidName: string = this.raid.instanceSizeSelection.getRaid().lfgName;
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
