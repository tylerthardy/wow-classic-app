import { Specialization, SpecializationData, specializations } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Paladin extends WowClass {
  constructor() {
    super(2, 6, 'Paladin');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    switch (role) {
      case WowRoleTrue.DPS:
        return specializations.find((spec) => spec.name === 'Retribution')!;
      case WowRoleTrue.HEALER:
        return specializations.find((spec) => spec.className === 'Paladin' && spec.name === 'Holy')!;
      case WowRoleTrue.TANK:
        return specializations.find((spec) => spec.className === 'Paladin' && spec.name === 'Protection')!;
      default:
        return;
    }
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
