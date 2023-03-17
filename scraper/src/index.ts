// import { Command } from 'commander';
import {
  IGearPlannerData,
  IWowSimsExport,
  Specialization,
  SpecializationData,
  specializations
} from 'classic-companion-core';
import * as fs from 'fs';
import { GearExtractor } from './gear-extractor';
import { TypescriptGenerator } from './typescript-generator';

//add the following line
// const program = new Command();

// program
//   .name('string-util') //
//   .description('CLI to some JavaScript string utilities') //
//   .version('0.0.1'); //

// // program
// //   .command('split')
// //   .description('Split a string into substrings and display as an array')
// //   .argument('<string>', 'string to split')
// //   .option('--first', 'display just the first substring')
// //   .option('-s, --separator <char>', 'separator character', ',')
// //   .action((str, options) => {
// //     const limit = options.first ? 1 : undefined;
// //     console.log(str.split(options.separator, limit));
// //   });

// program.parse();

(async () => {
  const outputPath: string = '../api/src/specialization/specialization-bis-data';
  const typescriptFileName: string = 'specialization-bis';
  const specs: SpecializationData[] = specializations.filter((spec) => !spec.isWarcraftLogsOnly);
  const processedSpecs: Specialization[] = [];

  for (const specData of specs) {
    const phase: number = 2;
    const spec: Specialization = new Specialization(specData);
    let gearUrl: string | undefined;
    let sets: { [key: string]: IGearPlannerData } | undefined;
    let path: string | undefined;
    let output: IWowSimsExport[];
    try {
      // get spec sets
      const extractor = new GearExtractor(spec, phase);
      gearUrl = extractor.getSpecGearUrl();
      sets = await extractor.extractGearDataFromPage(gearUrl);
      // transform if necessary
      output = extractor.convertGearPlannerSetsToWowSims(sets);
      // write sets json
      const filename: string = spec.getClassSpecRoleKebab();
      path = `${outputPath}/${filename}.json`;
      fs.writeFileSync(path, JSON.stringify(output));
      // collect written specs
      processedSpecs.push(spec);
    } catch (err) {
      console.error('error during spec data parsing', {
        gearUrl,
        spec,
        err
      });
    }
  }

  fs.writeFileSync(
    `${outputPath}/${typescriptFileName}.ts`,
    TypescriptGenerator.generateGearExportJsonReferencedClassString(processedSpecs)
  );
})();
