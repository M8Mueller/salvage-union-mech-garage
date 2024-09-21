import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mech-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mech-status.component.html',
  styleUrl: './mech-status.component.css'
})
export class MechStatusComponent {
  @Input() structure: number = 0;
  @Input() energy: number = 0;
  @Input() heat: number = 0;

  @Input() bonusStructure: number = 0;
  @Input() bonusEnergy: number = 0;
  @Input() bonusHeat: number = 0;

  currentStructure: number = 0;
  currentEnergy: number = 0;
  currentHeat: number = 0;
}
