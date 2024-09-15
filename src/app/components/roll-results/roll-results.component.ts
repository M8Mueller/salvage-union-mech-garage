import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RollResult } from '../../types/mech';

@Component({
  selector: 'app-roll-results',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './roll-results.component.html',
  styleUrl: './roll-results.component.css'
})
export class RollResultsComponent {
  @Input() rollResults: RollResult[] = [];

}
