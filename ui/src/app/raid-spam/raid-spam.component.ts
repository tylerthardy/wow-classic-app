import { Component, Input, OnInit } from '@angular/core';
import { HtmlCopyUtil } from '../common/html-copy-util';
import { RaidData } from '../common/services/raids/raid-data.interface';
import { Raid } from '../common/services/raids/raid.interface';
import { raids } from '../common/services/raids/raids';
import { ToastService } from '../common/services/toast.service';

@Component({
  selector: 'app-raid-spam',
  templateUrl: './raid-spam.component.html',
  styleUrls: ['./raid-spam.component.scss']
})
export class RaidSpamComponent implements OnInit {
  @Input() raid: Partial<Raid> = {};

  constructor(private toast: ToastService) {}

  ngOnInit(): void {}

  get spamOutput(): string | undefined {
    if (!this.raid.instanceSlug || !this.raid.softReserveCount) {
      return undefined;
    }

    const instanceData: RaidData | undefined = raids.find((raid) => raid.softresSlug === this.raid.instanceSlug);
    if (!instanceData) {
      throw new Error('raid not found ' + this.raid.instanceSlug);
    }

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

  public copyOutput(): void {
    HtmlCopyUtil.copyInputValueById('spam-output');
  }
}
