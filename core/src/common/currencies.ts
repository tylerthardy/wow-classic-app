import { Currency } from './currency';

export class Currencies {
  public static BADGE_OF_FROST: Currency = new Currency(341, 'Badge of Frost', 334365, 49426);

  public static CURRENCY_BY_ID: Map<number, Currency> = new Map(
    [Currencies.BADGE_OF_FROST].map((c) => [c.currencyId, c])
  );
}
