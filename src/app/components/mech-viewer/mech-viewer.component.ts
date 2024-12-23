import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import type { Chassis, MechComponent, Pattern } from '../../types/mech';

import { CurrentMechService } from '../../services/current-mech.service';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';

import { MechCargoComponent } from '../mech-cargo/mech-cargo.component';
import { MechChassisComponent } from "../mech-chassis/mech-chassis.component";
import { MechComponentListComponent } from '../mech-component-list/mech-component-list.component';
import { MechModulesComponent } from '../mech-modules/mech-modules.component';
import { MechScrapCostComponent } from '../mech-scrap-cost/mech-scrap-cost.component';
import { MechStatusComponent } from '../mech-status/mech-status.component';
import { MechSystemsComponent } from '../mech-systems/mech-systems.component';

@Component({
  selector: 'app-mech-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MechCargoComponent,
    MechChassisComponent,
    MechComponentListComponent,
    MechModulesComponent,
    MechScrapCostComponent,
    MechStatusComponent,
    MechSystemsComponent,
    ReactiveFormsModule,
],
  templateUrl: './mech-viewer.component.html',
  styleUrl: './mech-viewer.component.css'
})
export class MechViewerComponent implements OnInit {
  techLevels = [1, 2, 3, 4, 5, 6];

  chassis: Chassis | null = null;
  systems: MechComponent[] = [];
  systemIds: number[] = []
  modules: MechComponent[] = [];
  moduleIds: number[] = []

  patterns: Pattern[] = [];

  patternForm: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });

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
    private currentMech: CurrentMechService,
    private data: DataService,
    private fb: FormBuilder,
    private storage: StorageService
  ) {
    this.currentMech.chassis$.subscribe((chassis) => {
      this.setChassis(chassis);
    });

    this.currentMech.systems$.subscribe((systems) => {
      this.setSystems(systems);
    });

    this.currentMech.modules$.subscribe((modules) => {
      this.setModules(modules);
    });
  }

  ngOnInit() {
    const patterns = this.storage.getData('patterns');

    if (patterns) {
      this.patterns = patterns;
    }
  }

  loadChassis(id: number) {
    this.currentMech.setChassis(id);
  }

  setChassis(chassis: Chassis | null) {
    if (chassis) {
      this.chassis = chassis;
      this.calculateValues();
    }
  }

  setModules(modules: MechComponent[]) {
    this.modules = modules;
    this.moduleIds = modules.map((m) => m.id);
    this.calculateValues();
  }

  setSystems(systems: MechComponent[]) {
    this.systems = systems;
    this.systemIds = systems.map((s) => s.id);
    this.calculateValues();
  }

  savePattern() {
    const pattern = {
      'name': this.patternForm.get('name')?.value || 'NO NAME',
      'chassis': this.chassis?.id || 1,
      'systems': this.systemIds,
      'modules': this.moduleIds,
    };

    this.patterns.push(pattern);

    this.storage.setData('patterns', this.patterns);
  }

  deletePattern(index: number) {
    this.patterns.splice(index, 1);

    this.storage.setData('patterns', this.patterns);
  }

  loadPattern(pattern: Pattern) {
    this.currentMech.setPattern(pattern);
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
