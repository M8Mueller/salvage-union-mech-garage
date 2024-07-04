import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MechComponent } from '../../types/mech';

@Component({
  selector: 'app-mech-component-picker',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mech-component-picker.component.html',
  styleUrl: './mech-component-picker.component.css'
})
export class MechComponentPickerComponent {
  @Input() componentList: MechComponent[] = [];
  @Input() availableSlots: number = 0;

  @Output() componentSelected: EventEmitter<number> = new EventEmitter<number>();

  selectComponent(id: number) {
    this.componentSelected.emit(id);
  }

}
