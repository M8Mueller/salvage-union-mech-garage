import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MechComponent } from '../../types/mech';

import { CurrentMechService } from '../../services/current-mech.service';
import { DataService } from '../../services/data.service';

import { MechComponentPickerComponent } from '../mech-component-picker/mech-component-picker.component';

@Component({
  selector: 'app-mech-modules',
  standalone: true,
  imports: [
    CommonModule,
    MechComponentPickerComponent
  ],
  templateUrl: './mech-modules.component.html',
  styleUrl: './mech-modules.component.css'
})
export class MechModulesComponent {
  @Input() slots: number = 0;
  @Input() bonusSlots: number = 0;

  @Output() componentsChanged = new EventEmitter<MechComponent[]>();

  moduleList: { [tl: string]: MechComponent[] } =
    this.data.moduleListByTechLevel;

  techLevels: string[] = Object.keys(this.moduleList);

  moduleIds: number[] = [];
  modules: MechComponent[] = [];

  usedSlots: number = 0;

  constructor(
    private currentMech: CurrentMechService,
    private data: DataService,
  ){
    this.currentMech.modules$.subscribe((modules) => {
      this.modules = modules;
      this.moduleIds = modules.map((m) => m.id);
      this.countSlots();
    });
  }

  addModule(id: number) {
    this.moduleIds.push(id);
    this.currentMech.setModules(this.moduleIds);
  }

  removeModule(index: number) {
    this.moduleIds.splice(index, 1);
    this.currentMech.setModules(this.moduleIds);
  }

  resetModules() {
    this.moduleIds.length = 0;
    this.currentMech.setModules(this.moduleIds);
  }

  countSlots() {
    this.usedSlots = this.modules.reduce(
      (count: number, module: any) => count + module.slots, 0);
  }
}
