export interface ItemNote {
  id: number;
  /**
   * Restrict to these classes (named roles erroneously)
   */
  roles: string[];
  /**
   * Restrict to these specs
   */
  specs: number[];
  /**
   * Hard reserve raider name
   */
  raider: string;
  /**
   * Is hard reserved
   */
  hardReserved: boolean;
  /**
   * Note about item rules
   */
  note: string;
  /**
   * Overrides default class restrictions
   */
  ignoreClassRestrict: boolean;
}
