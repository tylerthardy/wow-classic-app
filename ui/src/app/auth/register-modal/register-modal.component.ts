import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ThemeService } from '../../common/services/theme/theme.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent extends SimpleModalComponent<any, ISignUpResult> {
  isLoading: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, public themeService: ThemeService) {
    super();
  }

  ngOnInit(): void {}

  onSignup(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.signUp(this.email, this.password, {}, (err, result) => {
        this.isLoading = false;
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        if (!result) {
          alert('empty result');
          return;
        }
        this.result = result;
        this.close();
      });
    }
  }
}
