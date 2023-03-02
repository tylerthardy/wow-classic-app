import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-copy-icon',
  templateUrl: './copy-icon.component.html',
  styleUrls: ['./copy-icon.component.scss']
})
export class CopyIconComponent implements OnInit {
  @Input() click?: () => void;

  constructor() {}

  ngOnInit(): void {}

  public onClick(): void {
    if (this.click) {
      this.click();
    }
  }
}
