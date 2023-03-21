import { Component, OnInit, ViewChild } from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { navigation } from './app-routing.module';
import { LocalStorageService } from './common/services/local-storage.service';
import { RegionServerService } from './common/services/region-server.service';
import { ThemeService } from './common/services/theme/theme.service';

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
    public localStorageService: LocalStorageService,
    public regionServerService: RegionServerService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    // FIXME: Initialize somewhere higher?
    TimeAgo.addDefaultLocale(en);

    this.toastrService.overlayContainer = this.toastContainer;

    var fullWrapper = document.getElementsByClassName('full-wrapper')[0] as HTMLDivElement;
    var wrapper = document.getElementsByClassName('wrapper')[0] as HTMLDivElement;
    const observerFullWrapper = new MutationObserver(function (mutations, observer) {
      fullWrapper.style.height = '';
    });
    const observerWrapper = new MutationObserver(function (mutations, observer) {
      wrapper.style.height = '';
    });
    observerFullWrapper.observe(fullWrapper, {
      attributes: true,
      attributeFilter: ['style']
    });
    observerWrapper.observe(wrapper, {
      attributes: true,
      attributeFilter: ['style']
    });
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

  public onDiscordClick(): void {
    window.open('https://discord.gg/dJ8YvKn8AR', '_blank');
  }

  public onToggleThemeClick(): void {
    this.themeService.toggleTheme();
  }

  public onGettingStartedClick(): void {
    this.localStorageService.store('gettingStarted', 'hidden', false);
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
