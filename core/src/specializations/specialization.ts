import { camelCase, paramCase, pascalCase } from 'change-case';
import { WowClass } from '../common/wow-class';
import { GetSpecializationsOptions } from './get-specializations-options.interface';
import { SpecializationData } from './specialization-data.interface';
import { specializations } from './specializations';

export class Specialization {
  public className: string;
  public name: string;
  public role: string;
  public isWarcraftLogsOnly?: boolean;
  public iconUrl?: string;

  constructor(data: SpecializationData) {
    this.className = data.className;
    this.name = data.name;
    this.role = data.role;
    this.isWarcraftLogsOnly = data.isWarcraftLogsOnly;
    this.iconUrl = data.iconUrl;
  }

  public getClassKebab(): string {
    return paramCase(this.className);
  }
  public getSpecKebab(): string {
    return paramCase(this.name);
  }
  public getClassSpecKebab(): string {
    return paramCase(this.className) + '-' + paramCase(this.name);
  }
  public getClassSpecRoleKebab(): string {
    return paramCase(this.className) + '-' + paramCase(this.name) + '-' + paramCase(this.role);
  }
  public getClassPascal(): string {
    return pascalCase(this.className);
  }
  public getSpecPascal(): string {
    return pascalCase(this.name);
  }
  public getClassSpecPascal(): string {
    return camelCase(this.className) + pascalCase(this.name);
  }
  public getClassSpecRolePascal(): string {
    return camelCase(this.className) + pascalCase(this.name) + pascalCase(this.role);
  }

  public static getAllData(options: GetSpecializationsOptions): SpecializationData[] {
    let filteredSpecializations: SpecializationData[] = Object.assign([], specializations);
    if (options.omitWarcraftLogsSpecs) {
      filteredSpecializations = specializations.filter((spec) => !spec.isWarcraftLogsOnly);
    }
    return filteredSpecializations;
  }
  // TODO: Deprecate SpecializationData?
  public static getData(wowClass: WowClass, specializationName: string, role?: string): SpecializationData | undefined {
    const foundData: SpecializationData[] = specializations.filter(
      (spec) =>
        spec.className.toLowerCase() === wowClass.name.toLowerCase() &&
        spec.name.toLowerCase() === specializationName.toLowerCase() &&
        (!role || spec.role.toLowerCase() === role.toLowerCase())
    );
    if (foundData.length === 0) {
      console.log('no spec found');
      return undefined;
    }
    if (foundData.length > 1) {
      console.log('multiple specs found, returning first. try adding a role to limit to one');
    }
    return foundData[0];
  }
}
