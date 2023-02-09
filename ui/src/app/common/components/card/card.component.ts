import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() header?: string;
  @Input() collapsed: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public onHeaderClick(): void {
    this.collapsed = !this.collapsed;
  }

  public expand(): void {
    this.collapsed = false;
  }

  public collapse(): void {
    this.collapsed = true;
  }
}
