import { Component, Input, OnInit } from '@angular/core';
import { WowClass } from 'classic-companion-core';

@Component({
  selector: 'app-class-icon',
  templateUrl: './class-icon.component.html',
  styleUrls: ['./class-icon.component.scss']
})
export class ClassIconComponent implements OnInit {
  @Input() size?: 'small' | 'large';
  @Input() sizePx?: string;
  @Input() wowClass!: WowClass;

  public cssClasses: string = '';
  public styles: string = '';

  constructor() {}

  ngOnInit(): void {
    if (this.size) {
      this.cssClasses = 'class-icon-' + this.size;
    } else if (this.sizePx) {
      this.styles = `width: ${this.sizePx}; height:${this.sizePx}`;
    } else {
      throw new Error('size or sizePx must be specified');
    }
  }
}
