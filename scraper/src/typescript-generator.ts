import { IGearPlannerData, Specialization } from 'classic-companion-core';

export class TypescriptGenerator {
  public static generateGearExportClassString(classesSets: {
    [classKebab: string]: { [specKebab: string]: IGearPlannerData };
  }): string {
    let output: string = 'export const SPECIALIZATION_BIS: {[classSpecKebab: string]: IGearPlannerData} = {';
    for (let classKebab in classesSets) {
      output += '\n';
      output += this.getUnquotedJson(classesSets[classKebab]);
    }
    output += '\n}';
    return output;
  }

  public static generateGearExportJsonReferencedClassString(classSpecs: Specialization[]): string {
    const imports: string[] = [`import { IWowSimsExport } from 'classic-companion-core'`];
    const objectEntries: string[] = [];
    for (const classSpec of classSpecs) {
      const classSpecRoleKebab: string = classSpec.getClassSpecRoleKebab();
      const classSpecRolePascal: string = classSpec.getClassSpecRolePascal();
      imports.push(`import ${classSpecRolePascal}Json from './${classSpecRoleKebab}.json';`);
      objectEntries.push(`\t'${classSpecRoleKebab}': ${classSpecRolePascal}Json`);
    }
    const output: string = `// THIS FILE IS AUTOGENERATED FROM THE classic-companion-scraper PACKAGE. DO NOT MANUALLY EDIT.

${imports.join('\n')}

export const SPECIALIZATION_BIS: {[classSpecRoleKebab: string]: IWowSimsExport[]} = {
${objectEntries.join(',\n')}
}`;
    return output;
  }

  private static getUnquotedJson(object: any): string {
    const json = JSON.stringify(object);
    const unquoted = json.replace(/"([^"]+)":/g, '$1:');
    return unquoted;
  }
}