import { Theme } from '../services/theme/theme.type';

export class ParseUtil {
  public static getParseWarningColor(parseValue: number | undefined, theme?: Theme): string | undefined {
    console.log(theme);
    if (parseValue === undefined || parseValue < 25) return theme === 'light' ? '#f8a987' : '#4f372b';
    if (parseValue <= 50) return theme === 'light' ? '#ffe3a3' : '#4f4632';
    return undefined;
  }
}
