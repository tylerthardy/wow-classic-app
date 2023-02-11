import { Component, OnInit } from '@angular/core';
import { ToastService } from '../common/services/toast.service';
import { SpecializationData } from '../common/specialization/specialization-data.interface';
import { specializations } from '../common/specialization/specializations';
import { WowClass } from '../common/specialization/wow-class';
import { HtmlCopyUtil } from '../common/utils/html-copy-util';
import { VoaSpec } from './voa-spec.interface';
import { VoaSpecializationViewModel } from './voa-specialization.viewmodel';

@Component({
  selector: 'app-voa-raid-builder',
  templateUrl: './voa-raid-builder.component.html',
  styleUrls: ['./voa-raid-builder.component.scss']
})
export class VoaRaidBuilderComponent implements OnInit {
  public viewModels: VoaSpecializationViewModel[] = [];

  private voa25specs: VoaSpec[] = [
    { class: 'Death Knight', spec: 'Blood', lfgClass: 'dk', lfgSpec: 'tank' },
    { class: 'Death Knight', spec: 'DPS', lfgClass: 'dk', lfgSpec: 'dps' },
    { class: 'Druid', spec: 'Tank', lfgClass: 'druid', lfgSpec: 'tank' },
    { class: 'Druid', spec: 'Feral', lfgClass: 'druid', lfgSpec: 'feral' },
    { class: 'Druid', spec: 'Balance', lfgClass: 'druid', lfgSpec: 'boomkin' },
    {
      class: 'Druid',
      spec: 'Restoration',
      lfgClass: 'druid',
      lfgSpec: 'resto'
    },
    { class: 'Hunter', spec: 'DPS', lfgClass: 'hunter', lfgSpec: '' },
    { class: 'Mage', spec: 'DPS', lfgClass: 'mage', lfgSpec: '' },
    {
      class: 'Paladin',
      spec: 'Protection',
      lfgClass: 'pally',
      lfgSpec: 'tank'
    },
    {
      class: 'Paladin',
      spec: 'Retribution',
      lfgClass: 'pally',
      lfgSpec: 'ret'
    },
    { class: 'Paladin', spec: 'Holy', lfgClass: 'pally', lfgSpec: 'holy' },
    { class: 'Priest', spec: 'Heal', lfgClass: 'priest', lfgSpec: 'heal' },
    { class: 'Priest', spec: 'Shadow', lfgClass: 'priest', lfgSpec: 'dps' },
    { class: 'Rogue', spec: 'DPS', lfgClass: 'rogue', lfgSpec: '' },
    { class: 'Shaman', spec: 'Elemental', lfgClass: 'sham', lfgSpec: 'ele' },
    { class: 'Shaman', spec: 'Enhancement', lfgClass: 'sham', lfgSpec: 'enh' },
    {
      class: 'Shaman',
      spec: 'Restoration',
      lfgClass: 'sham',
      lfgSpec: 'resto'
    },
    { class: 'Warlock', spec: 'DPS', lfgClass: 'lock', lfgSpec: '' },
    { class: 'Warrior', spec: 'Protection', lfgClass: 'war', lfgSpec: 'tank' },
    { class: 'Warrior', spec: 'DPS', lfgClass: 'war', lfgSpec: 'dps' }
  ];

  constructor(private toast: ToastService) {
    this.viewModels = this.getSpecs(this.voa25specs);
  }

  ngOnInit(): void {}

  public onContainerClick(): void {
    this.copyOutput();
    this.toast.info('Copied!', 'LFG spam copied to clipboard');
  }

  public getLfgString(): string {
    const lfgClassesNeeded: string[] = [];

    const missingSpecs: VoaSpec[] = this.getMissingVoaSpecs();
    const specsByClass: { [key: string]: VoaSpec[] } = this.groupVoaSpecsByClass(missingSpecs);

    Object.entries(specsByClass).forEach((entry: [string, VoaSpec[]]) => {
      const wowClass: string = entry[0].toUpperCase();
      const specs: VoaSpec[] = entry[1];
      const specsNeeded: string = specs.map((spec) => spec.lfgSpec ?? '').join('/');
      if (specsNeeded) {
        lfgClassesNeeded.push([specsNeeded, wowClass].join(' '));
      } else {
        lfgClassesNeeded.push(wowClass);
      }
    });
    let lfgString: string = `LFM VoA25 spec -- ${lfgClassesNeeded.join(', ')} -- PST w GS`;
    return lfgString;
  }

  public onClearClick(): void {
    this.viewModels.forEach((viewModel) => (viewModel.selected = false));
  }

  public onCopyClick(): void {
    try {
      this.copyOutput();
    } catch (err) {
      console.error(err);
      this.toast.error('Error', (err as Error).toString());
      return;
    }
    this.toast.info('Copied!', 'LFG spam copied to clipboard');
  }

  public copyOutput(): void {
    HtmlCopyUtil.copyInputValueById('lfg-output');
  }

  private groupVoaSpecsByClass(voaSpecs: VoaSpec[]): {
    [key: string]: VoaSpec[];
  } {
    return voaSpecs.reduce((group: { [key: string]: VoaSpec[] }, voaSpec) => {
      const { lfgClass } = voaSpec;
      group[lfgClass] = group[lfgClass] ?? [];
      group[lfgClass].push(voaSpec);
      return group;
    }, {});
  }

  private getMissingVoaSpecs(): VoaSpec[] {
    return this.viewModels.filter((viewModel) => !viewModel.selected).map((model) => model.voaSpec);
  }

  private getSpecs(voaSpecs: VoaSpec[]): VoaSpecializationViewModel[] {
    return voaSpecs.map((voaSpec) => {
      if (voaSpec.spec === 'DPS' || voaSpec.spec === 'Tank' || voaSpec.spec === 'Heal') {
        const wowClass: WowClass | undefined = WowClass.getClassByName(voaSpec.class);
        if (!wowClass) {
          throw new Error('could not find class for class name ' + voaSpec.class);
        }
        return new VoaSpecializationViewModel(voaSpec, {
          className: voaSpec.class,
          role: voaSpec.spec,
          specializationName: voaSpec.spec,
          iconUrl: wowClass.getClassIconUrl()
        });
      }
      const foundSpec: SpecializationData | undefined = specializations.find(
        (spec) => spec.className === voaSpec.class && voaSpec.spec === spec.specializationName
      );
      if (!foundSpec) {
        throw new Error(`could not find spec ${voaSpec.class} for class ${voaSpec.spec}`);
      }
      const viewModel: VoaSpecializationViewModel = new VoaSpecializationViewModel(voaSpec, foundSpec);
      return viewModel;
    });
  }
}
