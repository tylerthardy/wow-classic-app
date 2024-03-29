import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../common/services/local-storage.service';
import { AppConfig } from '../config/app.config';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  constructor(private appConfig: AppConfig, private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    if (!this.appConfig.maintenance) {
      this.router.navigate(['/']);
    }
  }

  public onDiscordIconClick() {
    window.open(this.appConfig.discordUrl, '_blank');
  }

  public onKonami() {
    this.localStorageService.store('maintenance', 'bypass', true);
    this.router.navigate(['/']);
  }
}
