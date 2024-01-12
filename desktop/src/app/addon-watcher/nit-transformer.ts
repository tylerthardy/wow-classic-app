import { CurrencyInfo, IPostMyCharacter, IPostMyCharacters } from 'classic-companion-core';

export class NitTransformer {
  public static transform(nitImportData: any): IPostMyCharacters {
    const server = 'Benediction';
    const region = 'US';
    const characters: IPostMyCharacter[] = [];

    Object.entries(nitImportData.data.NITdatabase.global[server].myChars).forEach((kvp) => {
      const characterName = kvp[0];
      const value: any = kvp[1];
      const currencies = NitTransformer.transformCurrency(value.currency);
      characters.push({
        characterName,
        regionSlug: region,
        serverSlug: server,
        classSlug: value.classEnglish,
        hidden: false,
        lockouts: [],
        currencies
      });
    });

    const request: IPostMyCharacters = {
      characters
    };
    return request;
  }

  public static transformCurrency(currencyData: CurrencyInfo[]): { [currencyId: number]: number } {
    const currencyIdByName: { [key: string]: number } = {
      ['Emblem of Frost']: 341
    };
    const currencyMap: { [currencyId: number]: number } = {};
    currencyData.forEach((curr) => {
      const currencyId: number | undefined = currencyIdByName[curr.name];
      if (currencyId) {
        currencyMap[currencyId] = curr.count;
      }
    });
    return currencyMap;
  }
}
