import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-raid-stats',
  templateUrl: './player-raid-stats.component.html',
  styleUrls: ['./player-raid-stats.component.scss']
})
export class PlayerRaidStatsComponent implements OnInit {
  @Input() best?: number;
  @Input() median?: number;
  @Input() hardModes?: string[];
  @Input() hardModeCount?: number;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

  constructor() {}

  ngOnInit(): void {}
}
