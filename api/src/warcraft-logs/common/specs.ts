// Queried from WCL

export interface WclClass {
  id: number;
  name: string;
  specs: WclClassSpec[];
}

export interface WclClassSpec {
  id: number;
  name: string;
  slug: string;
}

export const WclClassSpecs = [
  {
    id: 1,
    name: 'Death Knight',
    specs: [
      {
        id: 1,
        name: 'Blood',
        slug: 'Blood'
      },
      {
        id: 2,
        name: 'Frost',
        slug: 'Frost'
      },
      {
        id: 3,
        name: 'Unholy',
        slug: 'Unholy'
      },
      {
        id: 4,
        name: 'Lichborne',
        slug: 'Lichborne'
      },
      {
        id: 5,
        name: 'Runeblade',
        slug: 'Runeblade'
      }
    ]
  },
  {
    id: 2,
    name: 'Druid',
    specs: [
      {
        id: 1,
        name: 'Balance',
        slug: 'Balance'
      },
      {
        id: 2,
        name: 'Feral',
        slug: 'Feral'
      },
      {
        id: 3,
        name: 'Guardian',
        slug: 'Guardian'
      },
      {
        id: 4,
        name: 'Restoration',
        slug: 'Restoration'
      },
      {
        id: 5,
        name: 'Warden',
        slug: 'Warden'
      }
    ]
  },
  {
    id: 3,
    name: 'Hunter',
    specs: [
      {
        id: 1,
        name: 'Beast Mastery',
        slug: 'BeastMastery'
      },
      {
        id: 2,
        name: 'Marksmanship',
        slug: 'Marksmanship'
      },
      {
        id: 3,
        name: 'Survival',
        slug: 'Survival'
      }
    ]
  },
  {
    id: 4,
    name: 'Mage',
    specs: [
      {
        id: 1,
        name: 'Arcane',
        slug: 'Arcane'
      },
      {
        id: 2,
        name: 'Fire',
        slug: 'Fire'
      },
      {
        id: 3,
        name: 'Frost',
        slug: 'Frost'
      }
    ]
  },
  {
    id: 6,
    name: 'Paladin',
    specs: [
      {
        id: 1,
        name: 'Holy',
        slug: 'Holy'
      },
      {
        id: 2,
        name: 'Protection',
        slug: 'Protection'
      },
      {
        id: 3,
        name: 'Retribution',
        slug: 'Retribution'
      },
      {
        id: 4,
        name: 'Justicar',
        slug: 'Justicar'
      }
    ]
  },
  {
    id: 7,
    name: 'Priest',
    specs: [
      {
        id: 1,
        name: 'Discipline',
        slug: 'Discipline'
      },
      {
        id: 2,
        name: 'Holy',
        slug: 'Holy'
      },
      {
        id: 3,
        name: 'Shadow',
        slug: 'Shadow'
      }
    ]
  },
  {
    id: 8,
    name: 'Rogue',
    specs: [
      {
        id: 1,
        name: 'Assassination',
        slug: 'Assassination'
      },
      {
        id: 2,
        name: 'Combat',
        slug: 'Combat'
      },
      {
        id: 3,
        name: 'Subtlety',
        slug: 'Subtlety'
      }
    ]
  },
  {
    id: 9,
    name: 'Shaman',
    specs: [
      {
        id: 1,
        name: 'Elemental',
        slug: 'Elemental'
      },
      {
        id: 2,
        name: 'Enhancement',
        slug: 'Enhancement'
      },
      {
        id: 3,
        name: 'Restoration',
        slug: 'Restoration'
      }
    ]
  },
  {
    id: 10,
    name: 'Warlock',
    specs: [
      {
        id: 1,
        name: 'Affliction',
        slug: 'Affliction'
      },
      {
        id: 2,
        name: 'Demonology',
        slug: 'Demonology'
      },
      {
        id: 3,
        name: 'Destruction',
        slug: 'Destruction'
      }
    ]
  },
  {
    id: 11,
    name: 'Warrior',
    specs: [
      {
        id: 1,
        name: 'Arms',
        slug: 'Arms'
      },
      {
        id: 2,
        name: 'Fury',
        slug: 'Fury'
      },
      {
        id: 3,
        name: 'Protection',
        slug: 'Protection'
      },
      {
        id: 4,
        name: 'Gladiator',
        slug: 'Gladiator'
      },
      {
        id: 5,
        name: 'Champion',
        slug: 'Champion'
      }
    ]
  }
];
