import { Component, OnInit } from '@angular/core';
import { SpecializationData, specializations } from 'classic-companion-core';
import { ToastService } from '../common/services/toast/toast.service';
import { WowClass } from '../common/specialization/wow-class';
import { HtmlCopyUtil } from '../common/utils/html-copy-util';
import { RaidPlayerRole } from '../raid-lookup/raid-player-role.type';
import { IVoaSpec } from './voa-spec.interface';
import { VoaSpecializationViewModel } from './voa-specialization.viewmodel';

@Component({
  selector: 'app-voa-raid-builder',
  templateUrl: './voa-raid-builder.component.html',
  styleUrls: ['./voa-raid-builder.component.scss']
})
export class VoaRaidBuilderComponent implements OnInit {
  public viewModels: VoaSpecializationViewModel[] = [];

  public get totalCount(): number {
    return this.viewModels.filter((vm) => vm.selected).length;
  }
  public get roleCountsString(): string {
    const counts: { [key in RaidPlayerRole]: number } = {
      DAMAGER: 0,
      HEALER: 0,
      TANK: 0
    };
    this.viewModels.forEach((vm) => {
      if (vm.selected) {
        counts[vm.voaSpec.role]++;
      }
    });

    return `TANK: ${counts['TANK']} HEALER: ${counts['HEALER']} DAMAGER: ${counts['DAMAGER']}`;
  }

  private voa25specs: IVoaSpec[] = [
    { class: 'Death Knight', spec: 'Blood', lfgClass: 'dk', lfgSpec: 'tank', role: 'TANK' },
    { class: 'Death Knight', spec: 'DPS', lfgClass: 'dk', lfgSpec: 'dps', role: 'DAMAGER' },
    { class: 'Druid', spec: 'Tank', lfgClass: 'druid', lfgSpec: 'tank', role: 'TANK' },
    { class: 'Druid', spec: 'Feral', lfgClass: 'druid', lfgSpec: 'feral', role: 'DAMAGER' },
    { class: 'Druid', spec: 'Balance', lfgClass: 'druid', lfgSpec: 'boomkin', role: 'DAMAGER' },
    { class: 'Druid', spec: 'Restoration', lfgClass: 'druid', lfgSpec: 'resto', role: 'HEALER' },
    { class: 'Hunter', spec: 'DPS', lfgClass: 'hunter', lfgSpec: '', role: 'DAMAGER' },
    { class: 'Mage', spec: 'DPS', lfgClass: 'mage', lfgSpec: '', role: 'DAMAGER' },
    { class: 'Paladin', spec: 'Protection', lfgClass: 'pally', lfgSpec: 'prot', role: 'TANK' },
    { class: 'Paladin', spec: 'Retribution', lfgClass: 'pally', lfgSpec: 'ret', role: 'DAMAGER' },
    { class: 'Paladin', spec: 'Holy', lfgClass: 'pally', lfgSpec: 'holy', role: 'HEALER' },
    { class: 'Priest', spec: 'Heal', lfgClass: 'priest', lfgSpec: 'heal', role: 'HEALER' },
    { class: 'Priest', spec: 'Shadow', lfgClass: 'priest', lfgSpec: 'shadow', role: 'DAMAGER' },
    { class: 'Rogue', spec: 'DPS', lfgClass: 'rogue', lfgSpec: '', role: 'DAMAGER' },
    { class: 'Shaman', spec: 'Elemental', lfgClass: 'sham', lfgSpec: 'ele', role: 'DAMAGER' },
    { class: 'Shaman', spec: 'Enhancement', lfgClass: 'sham', lfgSpec: 'enh', role: 'DAMAGER' },
    { class: 'Shaman', spec: 'Restoration', lfgClass: 'sham', lfgSpec: 'resto', role: 'HEALER' },
    { class: 'Warlock', spec: 'DPS', lfgClass: 'lock', lfgSpec: '', role: 'DAMAGER' },
    { class: 'Warrior', spec: 'Protection', lfgClass: 'war', lfgSpec: 'tank', role: 'TANK' },
    { class: 'Warrior', spec: 'DPS', lfgClass: 'war', lfgSpec: 'dps', role: 'DAMAGER' }
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

    const missingSpecs: IVoaSpec[] = this.getMissingVoaSpecs();
    const specsByClass: { [key: string]: IVoaSpec[] } = this.groupVoaSpecsByClass(missingSpecs);

    Object.entries(specsByClass).forEach((entry: [string, IVoaSpec[]]) => {
      const wowClass: string = entry[0].toUpperCase();
      const specs: IVoaSpec[] = entry[1];
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

  private groupVoaSpecsByClass(voaSpecs: IVoaSpec[]): {
    [key: string]: IVoaSpec[];
  } {
    return voaSpecs.reduce((group: { [key: string]: IVoaSpec[] }, voaSpec) => {
      const { lfgClass } = voaSpec;
      group[lfgClass] = group[lfgClass] ?? [];
      group[lfgClass].push(voaSpec);
      return group;
    }, {});
  }

  private getMissingVoaSpecs(): IVoaSpec[] {
    return this.viewModels.filter((viewModel) => !viewModel.selected).map((model) => model.voaSpec);
  }

  private getSpecs(voaSpecs: IVoaSpec[]): VoaSpecializationViewModel[] {
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
