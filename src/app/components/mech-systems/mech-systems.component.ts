import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MechComponent } from '../../types/mech';

import { CurrentMechService } from '../../services/current-mech.service';
import { DataService } from '../../services/data.service';

import { MechComponentPickerComponent } from '../mech-component-picker/mech-component-picker.component';

@Component({
  selector: 'app-mech-systems',
  standalone: true,
  imports: [
    CommonModule,
    MechComponentPickerComponent
  ],
  templateUrl: './mech-systems.component.html',
  styleUrl: './mech-systems.component.css'
})
export class MechSystemsComponent {
  @Input() slots: number = 0;
  @Input() bonusSlots: number = 0;

  @Output() componentsChanged = new EventEmitter<MechComponent[]>();

  systemList: { [tl: string]: MechComponent[] } =
    this.data.systemListByTechLevel;

  techLevels: string[] = Object.keys(this.systemList);

  systemIds: number[] = [];
  systems: MechComponent[] = [];

  usedSlots: number = 0;

  constructor(
    private currentMech: CurrentMechService,
    private data: DataService,
  ){
    this.currentMech.systems$.subscribe((systems) => {
      this.systems = systems;
      this.systemIds = systems.map((s) => s.id);
      this.countSlots();
    });
  }

  addSystem(id: number) {
    this.systemIds.push(id);
    this.currentMech.setSystems(this.systemIds);
  }

  removeSystem(index: number) {
    this.systemIds.splice(index, 1);
    this.currentMech.setSystems(this.systemIds);
  }

  resetSystems() {
    this.systemIds.length = 0;
    this.currentMech.setSystems(this.systemIds);
  }

  countSlots() {
    this.usedSlots = this.systems.reduce(
      (count: number, system: any) => count + system.slots, 0);
  }
}
