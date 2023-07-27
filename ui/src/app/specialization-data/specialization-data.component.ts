import { Component, OnInit } from '@angular/core';
import { ISpecializationData, Specialization } from 'classic-companion-core';
import { LocalStorageService } from '../common/services/local-storage.service';

@Component({
  selector: 'app-specialization-data',
  templateUrl: './specialization-data.component.html',
  styleUrls: ['./specialization-data.component.scss']
})
export class ISpecializationDataComponent implements OnInit {
  specializations: ISpecializationData[];
  visibleSpecs: number[] = [25, 26, 18, 17, 23, 29, 30, 10, 19];
  selectedSpecialization: ISpecializationData | undefined;
  showSettings: boolean = false;

  constructor(private localStorageService: LocalStorageService) {
    this.specializations = Specialization.getAllData({
      omitWarcraftLogsSpecs: true
    });
  }

  ngOnInit(): void {
    const storedSpecs: number[] = this.localStorageService.get('ISpecializationData', 'visibleSpecs');
    if (storedSpecs?.length > 0) {
      this.visibleSpecs = storedSpecs;
    }
  }

  onSpecializationButtonClick(specializationIndex: number): void {
    const selectedSpecialization: ISpecializationData = this.specializations[specializationIndex];
    if (selectedSpecialization === this.selectedSpecialization) {
      this.selectedSpecialization = undefined;
    } else {
      this.selectedSpecialization = this.specializations[specializationIndex];
    }
  }

  onToggleSpecializationVisibility(specializationIndex: number): void {
    const specIndex: number = this.visibleSpecs.findIndex((v) => v == specializationIndex);

    if (specIndex === -1) {
      this.visibleSpecs.push(specializationIndex);
    } else {
      this.visibleSpecs.splice(specIndex, 1);
    }
    this.localStorageService.store('ISpecializationData', 'visibleSpecs', this.visibleSpecs);
  }

  onToggleSettingsButton(): void {
    this.showSettings = !this.showSettings;
  }

  onPhaseBisClick(phaseNumber: number): void {
    window.open(this.getPhaseBisUrl(this.selectedSpecialization!, phaseNumber), '_blank');
  }

  onStatPriorityClick(): void {
    window.open(this.getStatPriorityUrl(this.selectedSpecialization!), '_blank');
  }

  getSpecializationButtonClasses(specializationIndex: number): {
    [key: string]: boolean;
  } {
    const visible: boolean = this.visibleSpecs.findIndex((visibleIndex) => visibleIndex === specializationIndex) !== -1;
    return {
      selected: visible
    };
  }

  private getPhaseBisUrl(specialization: ISpecializationData, phaseNumber: number): string {
    const classSlug: string = specialization.className.replace(' ', '-').toLowerCase();
    const specNameSlug: string = specialization.name.replace(' ', '-').toLowerCase();
    const roleSlug: string = specialization.role.toLowerCase();

    const url: string = `https://www.wowhead.com/wotlk/guide/classes/${classSlug}/${specNameSlug}/${roleSlug}-bis-gear-pve-phase-${phaseNumber}`;
    return url;
  }

  private getStatPriorityUrl(specialization: ISpecializationData): string {
    const classSlug: string = specialization.className.replace(' ', '-').toLowerCase();
    const specNameSlug: string = specialization.name.replace(' ', '-').toLowerCase();
    const roleSlug: string = specialization.role.toLowerCase();

    const url: string = `https://www.wowhead.com/wotlk/guide/classes/${classSlug}/${specNameSlug}/${roleSlug}-stat-priority-attributes-pve`;
    return url;
  }
}
