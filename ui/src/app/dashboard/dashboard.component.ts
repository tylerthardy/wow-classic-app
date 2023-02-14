import { Component, OnInit } from '@angular/core';
import { IRaidSizeSelection } from '../common/components/raid-size-selection/raid-size-selection.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  valoo: IRaidSizeSelection = {
    raid: 'wotlknaxx',
    size10: true,
    size25: false
  };
  constructor() {}

  ngOnInit(): void {}
}
