import { Raid, Raids } from 'classic-companion-core';
import { MyCharacterLockoutSaveLockout } from './imports/my-characters-lockouts-save.interface';
import { NitImportLockout } from './imports/nit-import.interface';

export class CharacterRaidStatus {
  public raid: Raid | undefined; // TODO: Fix this. Dungeon uses undefined, but we shouldn't get this far.
  public get completed(): boolean {
    return this.manuallyCompletedOn > 0 || this.isResetAfterNow();
  }
  public manuallyCompletedOn: number = -1;
  public expires?: number;
  public itemsNeeded: number[] = [];
  public scheduledDay?: string;
  public scheduledTime?: string;
  public notes?: string;
  public needsToRun: boolean = true;

  constructor(lockoutData?: NitImportLockout | MyCharacterLockoutSaveLockout) {
    if (lockoutData instanceof NitImportLockout) {
      this.raid = lockoutData.getRaid();
      this.expires = lockoutData.resetTime;
    }
    if (lockoutData instanceof MyCharacterLockoutSaveLockout) {
      this.raid = Raids.All.find((raid) => raid.slug === lockoutData.raidSlug); // TODO: Possible bug w undefined raid
      this.expires = lockoutData.expires;
      this.itemsNeeded = lockoutData.itemsNeeded;
      this.scheduledDay = lockoutData.scheduledDay;
      this.scheduledTime = lockoutData.scheduledTime;
      this.notes = lockoutData.notes;
      this.needsToRun = lockoutData.needsToRun;
      this.manuallyCompletedOn = lockoutData.manuallyCompletedOn;
    }
  }

  public getTooltip(): string {
    return [this.scheduledDay, this.scheduledTime, this.notes].join(' ');
  }

  public hasCustomData(): boolean {
    return (
      this.scheduledDay !== undefined ||
      this.scheduledTime !== undefined ||
      this.notes !== undefined ||
      (this.needsToRun !== true && this.needsToRun !== undefined) ||
      this.itemsNeeded.length > 0
    );
  }

  public patchLockout(imported: CharacterRaidStatus): void {
    if (imported.expires && imported.expires > this.manuallyCompletedOn) {
      this.manuallyCompletedOn = -1;
      this.expires = imported.expires;
    }
    if (this.manuallyCompletedOn > 0 && imported.expires === undefined) {
      this.manuallyCompletedOn = -1;
      this.expires = imported.expires;
    }
    if (this.expires === undefined) {
      this.expires = imported.expires;
      if (this.manuallyCompletedOn > 0) {
        this.manuallyCompletedOn = -1;
      }
    }
    if (this.expires && imported.expires && this.expires < imported.expires) {
      this.expires = imported.expires;
    }
  }

  private isResetAfterNow(): boolean {
    if (this.expires === undefined) {
      return false;
    }
    return this.expires * 1000 > Date.now();
  }
}
