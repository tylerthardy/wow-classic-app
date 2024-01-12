import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoService, IUserLogin } from '../cognito.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  loading: boolean;
  user: IUserLogin;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {
      email: 'dap.erterter@gmail.com',
      password: 'Password123'
    } as IUserLogin;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService
      .signIn(this.user)
      .then(() => {
        this.router.navigate(['/profile']);
      })
      .catch(() => {
        this.loading = false;
      });
  }
}
