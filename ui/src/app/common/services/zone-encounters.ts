//TODO: Use common/raids
export type Zone = { [key: string]: Encounter[] };
export type Encounter = { id: number; name: string };
export const ZoneEncounters: { [zoneName: string]: Encounter[] } = {
  Ulduar: [
    { id: 744, name: 'Flame Leviathan' },
    { id: 745, name: 'Ignis the Furnace Master' },
    { id: 746, name: 'Razorscale' },
    { id: 747, name: 'XT-002 Deconstructor' },
    { id: 748, name: 'The Assembly of Iron' },
    { id: 749, name: 'Kologarn' },
    { id: 750, name: 'Auriaya' },
    { id: 751, name: 'Hodir' },
    { id: 752, name: 'Thorim' },
    { id: 753, name: 'Freya' },
    { id: 754, name: 'Mimiron' },
    { id: 755, name: 'General Vezax' },
    { id: 756, name: 'Yogg-Saron' },
    { id: 757, name: 'Algalon the Observer' }
  ],
  Naxxramas: [
    { id: 101107, name: "Anub'Rekhan" },
    { id: 101108, name: 'Gluth' },
    { id: 101109, name: 'Gothik the Harvester' },
    { id: 101110, name: 'Grand Widow Faerlina' },
    { id: 101111, name: 'Grobbulus' },
    { id: 101112, name: 'Heigan the Unclean' },
    { id: 101113, name: 'Instructor Razuvious' },
    { id: 101114, name: "Kel'Thuzad" },
    { id: 101115, name: 'Loatheb' },
    { id: 101116, name: 'Maexxna' },
    { id: 101117, name: 'Noth the Plaguebringer' },
    { id: 101118, name: 'Patchwerk' },
    { id: 101119, name: 'Sapphiron' },
    { id: 101120, name: 'Thaddius' },
    { id: 101121, name: 'The Four Horsemen' }
  ],
  'The Obsidian Sanctum': [
    { id: 736, name: 'Tenebron' },
    { id: 738, name: 'Shadron' },
    { id: 740, name: 'Vesperon' },
    { id: 742, name: 'Sartharion' }
  ],
  'The Eye of Eternity': [{ id: 734, name: 'Malygos' }]
};

export const ZoneEncountersById: {
  [id: number]: { zone: string; name: string };
} = getZoneEncountersById();

function getZoneEncountersById(): {
  [id: number]: {
    zone: string;
    name: string;
  };
} {
  const encountersById: { [id: number]: { zone: string; name: string } } = {};
  Object.keys(ZoneEncounters).forEach((zone: string) => {
    Object.values(ZoneEncounters[zone]).forEach((entry) => {
      encountersById[entry.id] = {
        name: entry.name,
        zone: zone
      };
    });
  });
  return encountersById;
}
