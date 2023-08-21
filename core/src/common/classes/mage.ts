import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Mage extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Mage',
      name: 'Arcane',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_magicalsentry.jpg',
      role: 'DPS'
    },
    {
      className: 'Mage',
      name: 'Fire',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_fire_firebolt02.jpg',
      role: 'DPS'
    },
    {
      className: 'Mage',
      name: 'Frost',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_frost_frostbolt02.jpg',
      role: 'DPS'
    }
  ];

  constructor() {
    super(8, 4, 'Mage');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    return undefined;
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
