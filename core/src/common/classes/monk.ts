import { Specialization, SpecializationData } from '../../specializations';
import { WowClass, WowRoleTrue } from '../wow-class';

export class Monk extends WowClass {
  constructor() {
    super(10, 5, 'Monk');
  }
  public override getFirstRoleSpecialization(role: WowRoleTrue, id?: number): SpecializationData | undefined {
    throw new Error('Method not implemented.');
  }
  public override getSpecializations(): Specialization[] {
    throw new Error('Method not implemented.');
  }
}
