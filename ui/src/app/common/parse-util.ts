export class ParseUtil {
  public static getParseWarningColor(parseValue: number): string | undefined {
    if (parseValue < 25) return '#f8a987';
    if (parseValue <= 50) return '#ffe3a3';
    return undefined;
  }
}
