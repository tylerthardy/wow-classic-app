import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from './cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated: boolean;

  constructor(private router: Router, protected cognitoService: CognitoService) {
    this.isAuthenticated = false;
  }

  public ngOnInit(): void {
    this.cognitoService.isAuthenticated().then((success: boolean) => {
      this.isAuthenticated = success;
    });
  }

  protected onRegisterButtonClick(): void {
    this.router.navigate(['sign-up']);
  }

  protected onSignInButtonClick(): void {
    this.router.navigate(['sign-in']);
  }

  protected onSignOutButtonClick(): void {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['/sign-in']);
    });
  }
}
