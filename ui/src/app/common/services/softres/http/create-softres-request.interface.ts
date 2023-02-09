import { SoftresRaidSlug } from '../softres-raid-slug';

export interface CreateSoftresRequest {
  /**
   * Slug of expansion
   */
  edition: 'wotlk' | 'classic' | 'tbc';
  /**
   * Slug of the raid
   */
  instance: SoftresRaidSlug;
  /**
   * Faction
   */
  faction: 'Alliance' | 'Horde';
  /**
   * Enable Discord protection.
   */
  discord: boolean;
  /**
   * Soft-reserve limit
   */
  amount: number;
  /**
   * Per-item soft-reserve limit (2x 3x etc.); 0 = unlimited
   */
  itemLimit: number;
  /**
   * Soft-reserves stay hidden for all raiders except the raidleader. Can be toggled later.
   * default: false
   */
  hideReserves: boolean;
  /**
   * Use +1 logic for soft-reserves
   * default: 1
   */
  plusModifier: number;
  /**
   * Allow soft-reservers to set character notes
   * default: true
   */
  characterNotes: boolean;
  /**
   * Class-specific items will only be soft-reserved by its class
   * default: true
   */
  restrictByClass: boolean;
  /**
   * Soft-reservers can pick same item multiple times
   * default: true
   */
  allowDuplicate: boolean;
}
