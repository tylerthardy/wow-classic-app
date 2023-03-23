import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  constructor(private appConfig: AppConfig, private router: Router) {}

  ngOnInit(): void {
    if (!this.appConfig.maintenance) {
      this.router.navigate(['/']);
    }
  }

  public onDiscordIconClick() {
    window.open(this.appConfig.discordUrl, '_blank');
  }
}
