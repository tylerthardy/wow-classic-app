import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Warrior extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Warrior',
      name: 'Arms',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_savageblow.jpg',
      role: 'DPS'
    },
    {
      className: 'Warrior',
      name: 'Fury',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_innerrage.jpg',
      role: 'DPS'
    },
    {
      className: 'Warrior',
      name: 'Protection',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/inv_shield_06.jpg',
      role: 'Tank'
    },
    {
      className: 'Warrior',
      name: 'Champion',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/shield_draenorcrafted_d_02_c_horde.jpg',
      role: 'Tank',
      isWarcraftLogsOnly: true
    },
    {
      className: 'Warrior',
      name: 'Gladiator',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_warrior_gladiatorstance.jpg',
      role: 'Tank',
      isWarcraftLogsOnly: true
    }
  ];

  constructor() {
    super(1, 11, 'Warrior');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    switch (role) {
      case WowRoleTrue.DPS:
        return this.specializations[1];
      case WowRoleTrue.TANK:
        return this.specializations[2];
      default:
        return undefined;
    }
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
