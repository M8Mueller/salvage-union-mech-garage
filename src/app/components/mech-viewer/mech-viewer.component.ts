import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import type { Chassis, MechComponent, Pattern } from '../../types/mech.d';

import { DataService } from '../../services/data.service';

import { MechCargoComponent } from '../mech-cargo/mech-cargo.component';
import { MechChassisComponent } from "../mech-chassis/mech-chassis.component";
import { MechComponentListComponent } from '../mech-component-list/mech-component-list.component';
import { MechScrapCostComponent } from '../mech-scrap-cost/mech-scrap-cost.component';
import { MechStatusComponent } from '../mech-status/mech-status.component';

@Component({
  selector: 'app-mech-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MechCargoComponent,
    MechChassisComponent,
    MechComponentListComponent,
    MechScrapCostComponent,
    MechStatusComponent,
],
  templateUrl: './mech-viewer.component.html',
  styleUrl: './mech-viewer.component.css'
})
export class MechViewerComponent {
  techLevels = [1, 2, 3, 4, 5, 6];

  chassisListByTechLevel: { [tl: number]: Chassis[] } =
    this.data.chassisListByTechLevel;
  moduleListByTechLevel: { [tl: number]: MechComponent[] } =
    this.data.moduleListByTechLevel;
  systemListByTechLevel: { [tl: number]: MechComponent[] } =
    this.data.systemListByTechLevel;

  chassis: Chassis | null = null;
  systems: MechComponent[] = [];
  modules: MechComponent[] = [];

  // Bonus Stats

  bonusStructure: number = 0;
  bonusEnergy: number = 0;
  bonusHeat: number = 0;
  bonusCargo: number = 0;
  bonusSystemSlots: number = 0;
  bonusModuleSlots: number = 0;

  // Scrap Cost

  scrapCost: { [id: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  }

  constructor(
    private data: DataService,
  ) {
  }

  setChassis(chassis: Chassis | null) {
    if (chassis) {
      this.chassis = chassis;
      this.calculateValues();
    }
  }

  setModules(modules: MechComponent[]) {
    this.modules = modules;
    this.calculateValues();
  } 

  setSystems(systems: MechComponent[]) {
    this.systems = systems;
    this.calculateValues();
  }

  // Calculations
  
  calculateValues() {
    this.calculateScrapCost();
    this.calculateBonuses();
  }

  calculateScrapCost() {
    this.techLevels.forEach(
      (tl) => this.scrapCost[tl] = 0);

    if (this.chassis) {
      this.scrapCost[this.chassis.tech_level] = this.chassis.salvage_value;
    }

    this.systems.forEach(
      (sys: any) => this.scrapCost[sys.tech_level] += sys.salvage_value);

    this.modules.forEach(
      (mod: any) => this.scrapCost[mod.tech_level] += mod.salvage_value);
  }

  calculateBonuses() {
    const components = [...this.systems, ...this.modules];

    this.bonusHeat = components.reduce(
      (count: number, comp: any) => count + (comp.heat_cap || 0),
      0
    );

    this.bonusCargo = components.reduce(
      (count: number, comp: any) => count + (comp.cargo_cap || 0),
      0
    );

    this.bonusSystemSlots = this.modules.reduce(
      (count: number, mod: any) => count + (mod.system_slots || 0),
      0
    );

    this.bonusModuleSlots = this.systems.reduce(
      (count: number, sys: any) => count + (sys.module_slots || 0),
      0
    );
  }

}
