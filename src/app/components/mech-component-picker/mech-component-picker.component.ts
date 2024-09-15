import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MechComponent } from '../../types/mech';

import { ActionListComponent } from '../action-list/action-list.component';
import { EpTagComponent } from '../ep-tag/ep-tag.component';
import { TraitListComponent } from '../trait-list/trait-list.component';

@Component({
  selector: 'app-mech-component-picker',
  standalone: true,
  imports: [
    ActionListComponent,
    CommonModule,
    EpTagComponent,
    TraitListComponent
  ],
  templateUrl: './mech-component-picker.component.html',
  styleUrl: './mech-component-picker.component.css'
})
export class MechComponentPickerComponent {
  @Input() componentListByTechLevel: { [id:number]: MechComponent[] } = [];
  @Input() availableSlots: number = 0;

  @Output() componentSelected: EventEmitter<number> = new EventEmitter<number>();

  techLevels: number[] = [1, 2, 3, 4, 5, 6]

  selectComponent(id: number) {
    this.componentSelected.emit(id);
  }

}
