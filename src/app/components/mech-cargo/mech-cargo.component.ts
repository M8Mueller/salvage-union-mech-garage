import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mech-cargo',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mech-cargo.component.html',
  styleUrl: './mech-cargo.component.css'
})
export class MechCargoComponent {
  @Input() cargo: number = 0;
  @Input() bonusCargo: number = 0;

}
