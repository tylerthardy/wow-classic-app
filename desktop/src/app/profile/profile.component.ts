import { Component, OnInit } from '@angular/core';

import { CognitoService, IUserLogin } from '../cognito.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading: boolean;
  user: IUserLogin;

  constructor(private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUserLogin;
  }

  public ngOnInit(): void {
    // this.cognitoService.getUser().then((user: any) => {
    //   this.user = user.attributes;
    // });
  }

  public update(): void {
    this.loading = true;

    this.cognitoService
      .updateUser(this.user)
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }
}
