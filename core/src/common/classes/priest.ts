import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Priest extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Priest',
      name: 'Discipline',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_wordfortitude.jpg',
      role: 'Healer'
    },
    {
      className: 'Priest',
      name: 'Holy',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_guardianspirit.jpg',
      role: 'Healer'
    },
    {
      className: 'Priest',
      name: 'Shadow',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_shadowwordpain.jpg',
      role: 'DPS'
    }
  ];

  constructor() {
    super(5, 7, 'Priest');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    switch (role) {
      case WowRoleTrue.DPS:
        return this.specializations[2];
      case WowRoleTrue.HEALER:
        return this.specializations[0];
      default:
        return undefined;
    }
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
