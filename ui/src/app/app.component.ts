import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { RegionServerService } from './common/services/region-server.service';
import { ThemeService } from './common/services/theme/theme.service';
import { navigation } from './navigation';

export interface ContainerStyle {
  name: 'Left' | 'Middle' | 'Full';
  cssClass: { [key: string]: any };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer!: ToastContainerDirective;

  public isNavigationShown: boolean = false;
  public navigation = navigation;
  public containerStyle: number = 0;
  public containerStyles: ContainerStyle[] = [
    { name: 'Middle', cssClass: { 'middle-container': true } },
    { name: 'Left', cssClass: { 'left-container': true } },
    { name: 'Full', cssClass: { 'full-container': true } }
  ];

  constructor(
    private toastrService: ToastrService,
    public regionServerService: RegionServerService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }

  public get nextContainerStyle(): string {
    return this.containerStyles[this.nextContainerStyleIndex].name;
  }

  public onHamburgerClick(): void {
    this.isNavigationShown = !this.isNavigationShown;
  }

  public onDownloadButtonClick(): void {
    window.open('https://wowclassicapp-addon.s3.amazonaws.com/GroupMembersExporter.zip', '_blank');
  }

  public onToggleThemeClick(): void {
    this.themeService.toggleTheme();
  }

  public cycleContainerStyle(): void {
    this.containerStyle = this.nextContainerStyleIndex;
  }

  private get nextContainerStyleIndex(): number {
    let nextContainerStyleIndex = this.containerStyle + 1;
    if (nextContainerStyleIndex > this.containerStyles.length - 1) {
      nextContainerStyleIndex = 0;
    }
    return nextContainerStyleIndex;
  }
}
