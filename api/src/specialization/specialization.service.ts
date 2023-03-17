import { Injectable } from '@nestjs/common';
import { IWowSimsExport, Specialization, SpecializationData, WowClass } from 'classic-companion-core';
import { NotFoundError } from 'common-errors';
import { SPECIALIZATION_BIS } from './specialization-bis-data/specialization-bis';

@Injectable()
export class SpecializationService {
  public getBis(classKebab: string, specializationKebab: string, role: string): IWowSimsExport[] {
    const wowClass: WowClass | undefined = WowClass.getClassByKebab(classKebab);
    if (!wowClass) {
      throw new NotFoundError('no wow class found for kebab ' + classKebab);
    }
    const specializationData: SpecializationData | undefined = Specialization.getData(
      wowClass,
      specializationKebab,
      role
    );
    if (!specializationData) {
      throw new NotFoundError(
        `no specialization found for class ${wowClass.name} & specialization kebab ${specializationKebab}`
      );
    }
    const specialization: Specialization = new Specialization(specializationData);
    return SPECIALIZATION_BIS[specialization.getClassSpecRoleKebab()];
  }
}
