import { Raid, Raids } from 'classic-companion-core';
import { MyCharacterLockoutSaveLockout } from './imports/my-characters-lockouts-save.interface';
import { NitImportLockout } from './imports/nit-import.interface';

export class CharacterRaidStatus {
  public raid: Raid | undefined; // TODO: Fix this. Dungeon uses undefined, but we shouldn't get this far.
  public completed: boolean = false;
  public expires?: number;
  public itemsNeeded: number[] = [];
  public scheduledDay?: string;
  public scheduledTime?: string;
  public notes?: string;
  public needsToRun: boolean = true;

  constructor(lockoutData?: NitImportLockout | MyCharacterLockoutSaveLockout) {
    if (lockoutData instanceof NitImportLockout) {
      this.raid = lockoutData.getRaid();
      this.completed = this.isResetAfterNow(lockoutData.resetTime);
      this.expires = lockoutData.resetTime;
    }
    if (lockoutData instanceof MyCharacterLockoutSaveLockout) {
      this.raid = Raids.All.find((raid) => raid.slug === lockoutData.raidSlug); // TODO: Possible bug w undefined raid
      this.completed = this.isResetAfterNow(lockoutData.expires);
      this.expires = lockoutData.expires;
      this.itemsNeeded = lockoutData.itemsNeeded;
      this.scheduledDay = lockoutData.scheduledDay;
      this.scheduledTime = lockoutData.scheduledTime;
      this.notes = lockoutData.notes;
      this.needsToRun = lockoutData.needsToRun;
    }
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

  private isResetAfterNow(resetTime: number | undefined): boolean {
    if (resetTime === undefined) {
      return false;
    }
    return true;
    // return resetTime * 1000 > Date.now();
  }
}
