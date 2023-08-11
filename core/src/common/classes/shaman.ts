import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Shaman extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Shaman',
      name: 'Elemental',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_lightning.jpg',
      role: 'DPS'
    },
    {
      className: 'Shaman',
      name: 'Enhancement',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_lightningshield.jpg',
      role: 'DPS'
    },
    {
      className: 'Shaman',
      name: 'Restoration',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_magicimmunity.jpg',
      role: 'Healer'
    }
  ];
  constructor() {
    super(7, 9, 'Shaman');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    switch (role) {
      case WowRoleTrue.DPS:
        return this.specializations[0];
      case WowRoleTrue.HEALER:
        return this.specializations[2];
      default:
        return undefined;
    }
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
