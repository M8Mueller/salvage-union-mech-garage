import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-mech-scrap-cost',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mech-scrap-cost.component.html',
  styleUrl: './mech-scrap-cost.component.css'
})
export class MechScrapCostComponent implements OnChanges {
  @Input() scrapCost: any = null;

  techLevels: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.techLevels = Object.keys(this.scrapCost);
  }

  constructor() {
  }

}
