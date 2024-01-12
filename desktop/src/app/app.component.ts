import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { CognitoService } from './cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected isAuthenticated: boolean = false;

  constructor(private router: Router, protected cognitoService: CognitoService) {}

  public ngOnInit(): void {
    this.cognitoService.initialize();
    from(this.cognitoService.getUser()).subscribe((result) => {
      console.log('app getUser', result);
    });
    this.cognitoService.authenticated$.subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
  }

  protected onRegisterButtonClick(): void {
    this.router.navigate(['sign-up']);
  }

  protected onSignInButtonClick(): void {
    this.router.navigate(['sign-in']);
  }

  protected onSignOutButtonClick(): void {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['sign-in']);
    });
  }

  protected onClick(): void {
    this.cognitoService.getSession().subscribe((result) => {
      console.log('app getSession', result);
    });
  }
}
