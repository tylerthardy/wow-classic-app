import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CognitoUserAttribute, CognitoUserPool, ISignUpResult } from 'amazon-cognito-identity-js';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { environment } from 'src/environments/environment';
import { ThemeService } from '../../common/services/theme/theme.service';

interface IFormData {
  name: string;
  family_name: string;
  'custom:university': string;
  email: string;
  phone_number: string;
  [key: string]: string;
}

@Component({
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss']
})
export class SignUpModalComponent extends SimpleModalComponent<any, ISignUpResult> {
  isLoading: boolean = false;
  firstName: string = '';
  lastName: string = '';
  university: string = '';
  email: string = '';
  mobileNumber: string = '';
  password: string = '';

  constructor(public themeService: ThemeService) {
    super();
  }

  ngOnInit(): void {}

  onSignup(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      var poolData = {
        UserPoolId: environment.cognito.userPoolId,
        ClientId: environment.cognito.userPoolWebClientId
      };
      var userPool = new CognitoUserPool(poolData);
      var attributeList = [];
      let formData: IFormData = {
        name: this.firstName,
        family_name: this.lastName,
        'custom:university': this.university,
        email: this.email,
        phone_number: this.mobileNumber
      };

      for (let key in formData) {
        let attrData = {
          Name: key,
          Value: formData[key]
        };
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute);
      }
      userPool.signUp(this.email, this.password, attributeList, [], (err, result) => {
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
