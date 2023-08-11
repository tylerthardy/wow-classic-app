import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Rogue extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Rogue',
      name: 'Assassination',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_eviscerate.jpg',
      role: 'DPS'
    },
    {
      className: 'Rogue',
      name: 'Combat',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_backstab.jpg',
      role: 'DPS'
    },
    {
      className: 'Rogue',
      name: 'Subtlety',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_stealth.jpg',
      role: 'DPS'
    }
  ];

  constructor() {
    super(4, 8, 'Rogue');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    return this.specializations[0];
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
