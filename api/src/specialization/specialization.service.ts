import { Injectable } from '@nestjs/common';
import { IWowSimsExport, Specialization, SpecializationData, WowClass, WowClasses } from 'classic-companion-core';
import { NotFoundError } from 'common-errors';
import { SPECIALIZATION_BIS } from './specialization-bis-data/specialization-bis';

@Injectable()
export class SpecializationService {
  public getBis(classSlug: string, specializationKebab: string, role: string): IWowSimsExport[] {
    const wowClass: WowClass | undefined = WowClasses.getClassBySlug(classSlug.toUpperCase());
    if (!wowClass) {
      throw new NotFoundError('no wow class found for slug ' + classSlug);
    }
    const specializationData: SpecializationData | undefined = Specialization.getData(
      wowClass,
      specializationKebab,
      role
    );
    if (!specializationData) {
      throw new NotFoundError(
        `no specialization found for class ${wowClass.name} & specialization slug ${specializationKebab}`
      );
    }
    const specialization: Specialization = new Specialization(specializationData);
    return SPECIALIZATION_BIS[specialization.getClassSpecRoleKebab()];
  }
}
