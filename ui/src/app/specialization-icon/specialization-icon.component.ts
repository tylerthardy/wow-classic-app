import { Component, Input, OnInit } from '@angular/core';
import { ISpecializationData } from 'classic-companion-core';

@Component({
  selector: 'app-specialization-icon',
  templateUrl: './specialization-icon.component.html',
  styleUrls: ['./specialization-icon.component.scss']
})
export class SpecializationIconComponent implements OnInit {
  @Input() size?: 'small' | 'large';
  @Input() sizePx?: string;
  @Input() specialization!: ISpecializationData;

  public classes: string = '';
  public styles: string = '';

  constructor() {}

  ngOnInit(): void {
    if (this.size) {
      this.classes = 'specialization-icon-' + this.size;
    } else if (this.sizePx) {
      this.styles = `width: ${this.sizePx}; height:${this.sizePx}`;
    } else {
      throw new Error('size or sizePx must be specified');
    }
  }
}
