import { Component, OnInit, ViewChild } from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { SimpleModalService } from 'ngx-simple-modal';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { navigation } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { RegisterModalComponent } from './auth/register-modal/register-modal.component';
import { SignInModalComponent } from './auth/sign-in-modal/sign-in-modal.component';
import { ConfirmModalComponent } from './common/components/confirm-modal/confirm-modal.component';
import { LocalStorageService } from './common/services/local-storage.service';
import { RegionServerService } from './common/services/region-server.service';
import { ThemeService } from './common/services/theme/theme.service';
import { ToastService } from './common/services/toast/toast.service';
import { AppConfig } from './config/app.config';

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
    public authService: AuthService,
    public localStorageService: LocalStorageService,
    public regionServerService: RegionServerService,
    public themeService: ThemeService,
    private simpleModalService: SimpleModalService,
    private appConfig: AppConfig,
    private toastrService: ToastrService,
    private toastService: ToastService
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
    window.open(this.appConfig.addonDownloadUrl, '_blank');
  }

  public onDiscordClick(): void {
    window.open(this.appConfig.discordUrl, '_blank');
  }

  public onToggleThemeClick(): void {
    this.themeService.toggleTheme();
  }

  public onGettingStartedClick(): void {
    this.localStorageService.store('gettingStarted', 'hidden', false);
  }

  public onRegisterButtonClick(): void {
    this.simpleModalService.addModal(RegisterModalComponent, {}).subscribe((result) => {
      if (result) {
        this.toastService.success('Account Created', 'Sign in with your username & password to get started');
      }
    });
  }

  public onSignInButtonClick(): void {
    this.simpleModalService.addModal(SignInModalComponent, {}).subscribe((result) => {
      this.toastService.info('Signed In', 'Welcome!');
    });
  }

  public onSignOutButtonClick(): void {
    this.simpleModalService
      .addModal(ConfirmModalComponent, {
        title: 'Sign Out',
        message: 'Are you sure you want to sign out?'
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.authService.signOut();
        }
      });
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
