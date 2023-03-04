import { Theme } from '../services/theme/theme.type';

export class ParseUtil {
  public static getParseWarningColor(parseValue: number | undefined, theme?: Theme): string | undefined {
    if (parseValue === undefined || parseValue < 25) return theme === 'light' ? '#f8a987' : '#4f372b';
    if (parseValue <= 50) return theme === 'light' ? '#ffe3a3' : '#4f4632';
    return undefined;
  }

  public static getDifferenceColor(differenceValue: number | undefined, theme?: Theme): string | undefined {
    if (!differenceValue || isNaN(differenceValue)) {
      return;
    }
    if (differenceValue > 0) {
      return theme === 'light' ? '#004000' : '#dcf4d9';
    } else {
      return theme === 'light' ? '#800000' : '#ff8080';
    }
  }
  public static getDifferenceBackgroundColor(differenceValue: number | undefined, theme?: Theme): string | undefined {
    if (!differenceValue || isNaN(differenceValue)) {
      return;
    }
    if (differenceValue > 0) {
      return theme === 'light' ? '#dcf4d9' : '#2b3829';
    } else {
      return theme === 'light' ? '#ff8080' : '#800000';
    }
  }

  public static getNotLockedInColor(theme?: Theme): string | undefined {
    return theme === 'light' ? '#004000' : '#dcf4d9';
  }
  public static getNotLockedInBackgroundColor(theme?: Theme): string | undefined {
    return theme === 'light' ? '#dcf4d9' : '#2b3829';
  }
}
