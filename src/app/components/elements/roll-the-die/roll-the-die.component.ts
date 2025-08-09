import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RollResult } from '@salvage-union-app/types/mech';

@Component({
  selector: 'app-roll-the-die',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './roll-the-die.component.html',
  styleUrl: './roll-the-die.component.css'
})
export class RollTheDieComponent {
  @Input() rollResults: RollResult[] = [];

}
