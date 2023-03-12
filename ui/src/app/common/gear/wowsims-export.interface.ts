export interface IWowSimsExportItem {
  id: number;
  gems: number[];
  enchant?: number;
}

export interface IWowSimsExport {
  talents: string; //'0503203100000000000000000000-000000000000000000000000000-325023051223010223152301351';
  glyphs: {
    major: string[]; //['Glyph of Shadow', 'Glyph of Mind Flay', 'Glyph of Dispersion'];
    minor: string[]; //['Glyph of Levitate', 'Glyph of Shadowfiend', 'Glyph of Fortitude'];
  };
  class: string; //'priest';
  race: string; //'Dwarf';
  name: string; //'Perterter';
  gear: {
    items: IWowSimsExportItem[];
    // [
    //   { enchant: 3820; gems: [41285, 39998]; id: 46172 },
    //   { id: 44661; gems: [40026] },
    //   { enchant: 3810; gems: []; id: 45253 },
    //   { enchant: 3722; gems: [40026]; id: 44005 },
    //   { enchant: 3832; gems: [40026, 40051]; id: 46168 },
    //   { enchant: 2332; gems: []; id: 39731 },
    //   { enchant: 3604; gems: [40051]; id: 46163 },
    //   { id: 45557; gems: [40026, 39998, 39998] },
    //   { enchant: 3872; gems: [39998, 40051]; id: 46170 },
    //   { enchant: 3606; gems: []; id: 45441 },
    //   { id: 45418; gems: [] },
    //   { id: 40719; gems: [] },
    //   { id: 40682; gems: [] },
    //   { id: 40255; gems: [] },
    //   { enchant: 3834; gems: [40051]; id: 46035 },
    //   { id: 40273; gems: [] },
    //   { id: 45257; gems: [] }
    // ];
  };
  professions: { name: string; level: number }[]; //[{ name: 'Engineering'; level: 442 }, { name: 'Tailoring'; level: 438 }];
  level: number; //80;
  spec: string; //'';
  realm: string; //'Benediction';
}
