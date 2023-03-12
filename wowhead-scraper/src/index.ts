// import { Command } from 'commander';
import * as fs from 'fs';
import { specializations } from './common/specializations';
import { GearExtractor } from './gear-extractor';
import { IGearPlannerData } from './gear-planner-data.interface';

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

const outputPath: string = './out';
const specs = specializations.filter((spec) => !spec.isWarcraftLogsOnly);
specs.forEach(async (spec) => {
  const phase: number = 2;
  const extractor = new GearExtractor(spec, phase);
  let gearUrl: string | undefined;
  let data: IGearPlannerData | undefined;
  let classSlug: string | undefined;
  let specNameSlug: string | undefined;
  let filename: string | undefined;
  try {
    gearUrl = extractor.getSpecGearUrl();
    data = await extractor.extractGearDataFromPage(gearUrl);
    classSlug = spec.className.replace(' ', '-').toLowerCase();
    specNameSlug = spec.specializationName.replace(' ', '-').toLowerCase();
    filename = `${outputPath}/${classSlug}-${specNameSlug}.json`;
    fs.writeFileSync(filename, JSON.stringify(data));
  } catch (err) {
    console.error('error during spec data parsing', {
      gearUrl,
      spec,
      err
    });
  }
});
