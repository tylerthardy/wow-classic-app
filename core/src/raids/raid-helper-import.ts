import { WowClasses } from '../common';
import { Specialization } from '../specializations';

const PLAYER_REGEX: RegExp = /:(\w*): (\d{1,2}) (\w+)/g;

export interface IRaidHelperImportInput {
  /**
   * Discord post data is when the entire raid-helper Discord post is copied as an input
   * Generally this is in Discord markdown syntax, with Discord emoji syntax
   */
  discordPostData?: string;

  /**
   * Json data exported from the Raid Helper website
   */
  json?: string;
}

export class RaidHelperImport {
  public characters: RaidHelperCharacter[] = [];

  constructor(input: IRaidHelperImportInput) {
    if (!input.discordPostData && !input.json) {
      throw new Error('Discord post data or json is required');
    }
    if (input.discordPostData) {
      this.characters = this.parseDiscordPostData(input.discordPostData);
    } else if (input.json) {
    }
  }

  private parseDiscordPostData(data: string): RaidHelperCharacter[] {
    const matches: RegExpMatchArray | null = data.match(PLAYER_REGEX);
    if (!matches || matches.length === 0) {
      return [];
    }
    const characters: RaidHelperCharacter[] = matches.map((match) => new RaidHelperCharacter(<string>match));
    return characters;
  }
}

class RaidHelperCharacter {
  public specialization!: Specialization;
  public signupOrder!: string;
  public name!: string;

  constructor(characterString: string) {
    this.parseCharacterString(characterString);
  }

  private parseCharacterString(characterString: string): void {
    for (let match in characterString.matchAll(/:(\w*): (\d{1,2}) (\w+)/g)) {
      if (match.length <= 1) {
        return;
      }
      if (match.length !== 4) {
        console.error('wrong length');
        return;
      }
      const specName = match[1];
      this.specialization = raidHelperSpecLookup[specName];
      this.signupOrder = match[2];
      this.name = match[3];
    }
  }
}

const raidHelperSpecLookup: { [specName: string]: Specialization } = {
  // TODO: Enum all specs
  Protection: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!), // war
  Protection1: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!), // paladin
  Blood_Tank: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!), // bdk
  Frost_DPS: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Unholy_DPS: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Fury: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Balance: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Feral: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Guardian: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Restoration: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!), // druid
  Retribution: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Holy1: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!), // hpal
  Assassination: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Combat: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Survival: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Beastmastery: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Marksmanship: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Arcane: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Fire: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Frost: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Destruction: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Demonology: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Affliction: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Shadow: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Discipline: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Holy2: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!), // priest
  Smite: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Elemental: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!),
  Restoration1: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!), // rsham
  Enhancement: new Specialization(Specialization.getData(WowClasses.DEATH_KNIGHT, 'unholy')!)
};
