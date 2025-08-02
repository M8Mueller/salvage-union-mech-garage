import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { CurrentMechService } from '@salvage-union-app/services/current-mech.service';
import { DataService } from '@salvage-union-app/services/data.service';

import { MechComponent } from '@salvage-union-app/types/mech';

import { MechComponentBrowserComponent } from '../mech-component-browser/mech-component-browser.component';
import { CardComponent } from '../elements/card/card.component';

@Component({
  selector: 'app-mech-modules',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    MechComponentBrowserComponent
  ],
  templateUrl: './mech-modules.component.html',
  styleUrl: './mech-modules.component.css'
})
export class MechModulesComponent {
  slots: number = 0;
  bonusSlots: number = 0;

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
    // Chassis subscription - base slots
    this.currentMech.chassis$.subscribe((chassis) => {
      if (chassis) {
        this.slots = chassis.module_slots;
      }
    });

    // Systems subscription - bonus slots
    this.currentMech.systems$.subscribe((components) => {
      this.bonusSlots = components.reduce(
        (count: number, component: any) => count + (component.module_slots || 0),
        0
      );
    });

    // Modules subscription - used slots
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
