import { IMyCharacterLockoutSaveLockout } from '../../../common';

export interface IPostMyCharacter {
  characterName: string;
  regionSlug: string;
  serverSlug: string;
  classSlug?: string | undefined;
  hidden: boolean;
  lockouts: IMyCharacterLockoutSaveLockout[];
  currencies?: { [currencyId: number]: number };
}
