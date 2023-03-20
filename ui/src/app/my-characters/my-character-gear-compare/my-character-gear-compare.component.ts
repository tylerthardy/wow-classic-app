import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IWowSimsExportItem, WOWSIMS_EXPORT_SLOTS } from 'classic-companion-core';
import { allItemsById } from '../../all-items-by-id';
import { ItemData } from '../../common/item-data.interface';

@Component({
  selector: 'app-my-character-gear-compare',
  templateUrl: './my-character-gear-compare.component.html',
  styleUrls: ['./my-character-gear-compare.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyCharacterGearCompareComponent implements OnInit {
  // FIXME: Concrete IWowSimsExport.gear into a viewmodel class
  @Input() myGear?: { items: (IWowSimsExportItem | null)[] };
  @Input() get compareGear(): { items: (IWowSimsExportItem | null)[] } | undefined {
    return this._compareGear;
  }
  set compareGear(gear: { items: (IWowSimsExportItem | null)[] } | undefined) {
    this._compareGear = gear;
    this.slotItemMetadata = this.getSetSlotMetadata(this.compareGear);
  }

  public SLOT_INDICES: number[] = Array.from(Array(17), (_, i) => i);
  public slotItemMetadata: { [slot: number]: ItemData | undefined } = {};

  private _compareGear?: { items: (IWowSimsExportItem | null)[] };

  constructor() {}

  ngOnInit(): void {}

  public hasItem(slot: number): boolean {
    const myItem: IWowSimsExportItem | null | undefined = this.myGear?.items[slot];
    const targetItem: IWowSimsExportItem | null | undefined = this.compareGear?.items[slot];
    if (!myItem || !targetItem) {
      return false;
    }
    if (slot === WOWSIMS_EXPORT_SLOTS.TRINKET1 || slot === WOWSIMS_EXPORT_SLOTS.TRINKET2) {
      return this.eitherItemMatchesTarget(
        targetItem,
        this.myGear?.items[WOWSIMS_EXPORT_SLOTS.TRINKET1],
        this.myGear?.items[WOWSIMS_EXPORT_SLOTS.TRINKET2]
      );
    }
    if (slot === WOWSIMS_EXPORT_SLOTS.FINGER1 || slot === WOWSIMS_EXPORT_SLOTS.FINGER2) {
      return this.eitherItemMatchesTarget(
        targetItem,
        this.myGear?.items[WOWSIMS_EXPORT_SLOTS.FINGER1],
        this.myGear?.items[WOWSIMS_EXPORT_SLOTS.FINGER2]
      );
    }

    return myItem.id === targetItem.id;
  }

  private eitherItemMatchesTarget(
    targetItem: IWowSimsExportItem | null | undefined,
    myItem1: IWowSimsExportItem | null | undefined,
    myItem2: IWowSimsExportItem | null | undefined
  ): boolean {
    if (!targetItem) {
      return true;
    }
    return targetItem.id === myItem1?.id || targetItem.id === myItem2?.id;
  }

  private getSetSlotMetadata(gear: { items: (IWowSimsExportItem | null)[] } | undefined): {
    [slot: number]: ItemData | undefined;
  } {
    if (!gear) {
      return {};
    }
    const metadata: { [slot: number]: ItemData | undefined } = {};
    gear.items.forEach((item, slot) => {
      if (!item || !item.id) {
        return;
      }
      metadata[slot] = this.getItemMetadata(item.id);
    });
    return metadata;
  }

  private getItemMetadata(id: number): ItemData | undefined {
    const foundItems: ItemData[] | undefined = allItemsById[id];
    if (!foundItems) {
      console.error('could not find item for id: ' + id);
      return undefined;
    }
    if (foundItems.length > 1) {
      console.warn(`${foundItems.length} items found for id ${id}, returning first`);
    }
    return foundItems[0];
  }
}
