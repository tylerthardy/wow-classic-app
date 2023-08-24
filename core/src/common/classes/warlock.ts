import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Warlock extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Warlock',
      name: 'Affliction',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_deathcoil.jpg',
      role: 'DPS'
    },
    {
      className: 'Warlock',
      name: 'Demonology',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_metamorphosis.jpg',
      role: 'DPS'
    },
    {
      className: 'Warlock',
      name: 'Destruction',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_rainoffire.jpg',
      role: 'DPS'
    }
  ];

  constructor() {
    super(9, 10, 'Warlock');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    return undefined;
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
