import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Druid extends WowClass {
  public override specializations: SpecializationData[] = [
    {
      className: 'Druid',
      name: 'Balance',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_starfall.jpg',
      role: 'DPS'
    },
    {
      className: 'Druid',
      name: 'Feral',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_racial_bearform.jpg',
      role: 'Tank'
    },
    {
      className: 'Druid',
      name: 'Guardian',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_racial_bearform.jpg',
      role: 'Tank',
      isWarcraftLogsOnly: true
    },
    {
      className: 'Druid',
      name: 'Warden',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_druid_predatoryinstincts.jpg',
      role: 'Tank',
      isWarcraftLogsOnly: true
    },
    {
      className: 'Druid',
      name: 'Feral',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/ability_druid_catform.jpg',
      role: 'DPS'
    },
    {
      className: 'Druid',
      name: 'Restoration',
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_healingtouch.jpg',
      role: 'Healer'
    }
  ];

  constructor() {
    super(11, 2, 'Druid');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    switch (role) {
      case WowRoleTrue.DPS:
        return this.specializations[0];
      case WowRoleTrue.TANK:
        return this.specializations[2];
      case WowRoleTrue.HEALER:
        return this.specializations[5];
      default:
        return undefined;
    }
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
