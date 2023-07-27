import { Injectable } from '@nestjs/common';
import { ISpecializationData, IWowSimsExport, Specialization, WowClass } from 'classic-companion-core';
import { NotFoundError } from 'common-errors';
import { SPECIALIZATION_BIS } from './specialization-bis-data/specialization-bis';

@Injectable()
export class SpecializationService {
  public getBis(classSlug: string, specializationKebab: string, role: string): IWowSimsExport[] {
    const wowClass: WowClass | undefined = WowClass.getClassBySlug(classSlug.toUpperCase());
    if (!wowClass) {
      throw new NotFoundError('no wow class found for slug ' + classSlug);
    }
    const ISpecializationData: ISpecializationData | undefined = Specialization.getData(
      wowClass,
      specializationKebab,
      role
    );
    if (!ISpecializationData) {
      throw new NotFoundError(
        `no specialization found for class ${wowClass.name} & specialization slug ${specializationKebab}`
      );
    }
    const specialization: Specialization = new Specialization(ISpecializationData);
    return SPECIALIZATION_BIS[specialization.getClassSpecRoleKebab()];
  }
}
