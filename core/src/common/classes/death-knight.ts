import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class DeathKnight extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Death Knight',
      name: 'Blood',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_bloodpresence.jpg',
      role: 'Tank'
    },
    {
      className: 'Death Knight',
      name: 'Runeblade',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_darkconviction.jpg',
      role: 'Tank',
      isWarcraftLogsOnly: true
    },
    {
      className: 'Death Knight',
      name: 'Lichborne',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_raisedead.jpg',
      role: 'Tank',
      isWarcraftLogsOnly: true
    },
    {
      className: 'Death Knight',
      name: 'Frost',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_frostpresence.jpg',
      role: 'DPS'
    },
    {
      className: 'Death Knight',
      name: 'Unholy',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_unholypresence.jpg',
      role: 'DPS'
    }
  ];

  constructor() {
    super(6, 1, 'Death Knight');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    switch (role) {
      case WowRoleTrue.DPS:
        return this.specializations[3];
      case WowRoleTrue.TANK:
        return this.specializations[0];
      default:
        return undefined;
    }
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
