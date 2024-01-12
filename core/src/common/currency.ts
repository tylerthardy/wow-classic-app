export class Currency {
  public currencyId: number;
  public name: string;
  public iconId: number;
  public itemId: number;

  constructor(currencyId: number, name: string, iconId: number, itemId: number) {
    this.currencyId = currencyId;
    this.name = name;
    this.iconId = iconId;
    this.itemId = itemId;
  }
}
