import { Component, Input, OnInit } from '@angular/core';
import { ISpecializationData } from 'classic-companion-core';

@Component({
  selector: 'app-parse-number',
  templateUrl: './parse-number.component.html',
  styleUrls: ['./parse-number.component.scss']
})
export class ParseNumberComponent implements OnInit {
  @Input() value!: number;
  @Input() specialization?: ISpecializationData;
  @Input() sizePx?: string;
  containerStyles: { [styleKey: string]: string } = {};

  get cssClasses(): string {
    const rankingRounded: number = Math.floor(this.value);
    if (rankingRounded === 100) {
      return 'q6';
    } else if (rankingRounded >= 99) {
      return 'c2';
    } else if (rankingRounded >= 95) {
      return 'q5';
    } else if (rankingRounded >= 75) {
      return 'q4';
    } else if (rankingRounded >= 50) {
      return 'q3';
    } else if (rankingRounded >= 25) {
      return 'q2';
    } else {
      return 'q0';
    }
  }

  constructor() {}

  ngOnInit(): void {
    if (this.sizePx) {
      this.containerStyles['font-size'] = this.sizePx;
    }
  }
}
