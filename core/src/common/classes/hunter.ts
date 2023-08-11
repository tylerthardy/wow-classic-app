import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Hunter extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Hunter',
      name: 'Beast Mastery',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_beasttaming.jpg',
      role: 'DPS'
    },
    {
      className: 'Hunter',
      name: 'Marksmanship',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_marksmanship.jpg',
      role: 'DPS'
    },
    {
      className: 'Hunter',
      name: 'Survival',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_swiftstrike.jpg',
      role: 'DPS'
    }
  ];

  constructor() {
    super(3, 3, 'Hunter');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    return this.specializations[2];
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
