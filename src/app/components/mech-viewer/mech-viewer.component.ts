import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import type { Chassis, MechComponent, Pattern } from '../../types/mech.d';

import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';

import { EpTagComponent } from '../ep-tag/ep-tag.component';
import { MechComponentPickerComponent } from '../mech-component-picker/mech-component-picker.component';

@Component({
  selector: 'app-mech-viewer',
  standalone: true,
  imports: [
    CommonModule,
    EpTagComponent,
    FormsModule,
    MechComponentPickerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './mech-viewer.component.html',
  styleUrl: './mech-viewer.component.css'
})
export class MechViewerComponent implements OnInit{
  techLevels = [1, 2, 3, 4, 5, 6];

  patternList: Pattern[] = [];

  chassisListByTechLevel: { [tl: number]: Chassis[] } = this.data.chassisListByTechLevel;
  moduleListByTechLevel: { [tl: number]: MechComponent[] } = this.data.moduleListByTechLevel;
  systemListByTechLevel: { [tl: number]: MechComponent[] } = this.data.systemListByTechLevel;

  chassis: any = null;

  bonusHeatCap: number = 0;
  bonusCargoCap: number = 0;

  bonusSystemSlotCount: number = 0;
  bonusModuleSlotCount: number = 0;

  systemSlotCount: number = 0;
  moduleSlotCount: number = 0;

  scrapCost: { [id: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  }

  mechForm: FormGroup = this.fb.group({
    chassis: [0],
    pattern: [0],
    systems: this.fb.array([]),
    modules: this.fb.array([]),
  });

  showScrapSection = true;

  // Get

  getPattern(id: number) {
    return this.patternList.find((pat) => pat.id === id);
  }

  // Systems

  systemsFormArray() {
    return this.mechForm.get('systems') as FormArray;
  }

  addSystem(id: number, setCustom: boolean = true) {
    const system = this.data.getSystem(id);
    this.addToFormArray(this.systemsFormArray(), system, setCustom);
    this.storeSystems();
  }

  removeSystem(index: number, setCustom: boolean = true) {
    this.removeFromFormArray(this.systemsFormArray(), index, setCustom);
    this.storeSystems();
  }

  clearSystems(setCustom: boolean = true) {
    this.clearFormArray(this.systemsFormArray(), setCustom);
    this.storeSystems();
  }

  storeSystems() {
    const systems = this.systemsFormArray().value.map(
      (s: MechComponent) => s.id);

    this.storage.setData('systems', systems);
  }

  // Modules

  modulesFormArray() {
    return this.mechForm.get('modules') as FormArray;
  }

  addModule(id: number, setCustom: boolean = true) {
    let module = this.data.getModule(id);
    this.addToFormArray(this.modulesFormArray(), module, setCustom);
    this.storeModules();
  }

  removeModule(index: number, setCustom: boolean = true) {
    this.removeFromFormArray(this.modulesFormArray(), index, setCustom);
    this.storeModules();
  }

  clearModules(setCustom: boolean = true) {
    this.clearFormArray(this.modulesFormArray(), setCustom);
    this.storeModules();
  }

  storeModules() {
    const modules = this.modulesFormArray().value.map(
      (s: MechComponent) => s.id);

    this.storage.setData('modules', modules);
  }

  // FormArray functions

  addToFormArray(formArray: FormArray, item: any, setCustom: boolean = true) {
    if (setCustom) {
      this.mechForm.get('pattern')?.setValue(0);
    }

    formArray.push(
      this.fb.group({
        'id': item.id,
        'name': item.name,
        'tech_level': item.tech_level,
        'slots': item.slots,
        'salvage_value': item.salvage_value,
        'heat_cap': item.heat_cap | 0,
        'cargo_cap': item.cargo_cap | 0,
        'system_slots': item.system_slots | 0,
        'module_slots': item.module_slots | 0
      })
    );

    this.calculateValues();
  }

  removeFromFormArray(formArray: FormArray, index: number, setCustom: boolean = true) {
    if (setCustom) {
      this.mechForm.get('pattern')?.setValue(0);
    }

    formArray.removeAt(index);

    this.calculateValues();
  }

  clearFormArray(formArray: FormArray, setCustom: boolean = true) {
    if (setCustom) {
      this.mechForm.get('pattern')?.setValue(0);
    }

    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }

    this.calculateValues();
  }

  // Calculations
  
  calculateValues() {
    this.calculateScrapCost();
    this.calculateBonuses();
    this.calculateSlotCounts();
  }

  calculateScrapCost() {
    this.techLevels.forEach(
      (tl) => this.scrapCost[tl] = 0);

    this.scrapCost[this.chassis.tech_level] = this.chassis.salvage_value;

    this.systemsFormArray().value.forEach(
      (sys: any) => this.scrapCost[sys.tech_level] += sys.salvage_value);

    this.modulesFormArray().value.forEach(
      (mod: any) => this.scrapCost[mod.tech_level] += mod.salvage_value);
  }

  calculateBonuses() {
    const systems = this.systemsFormArray().value;
    const modules = this.modulesFormArray().value;
    const components = [...systems, ...modules];

    this.bonusHeatCap = components.reduce(
      (count: number, comp: any) => count + comp.heat_cap | 0,
      0
    );

    this.bonusCargoCap = components.reduce(
      (count: number, comp: any) => count + comp.cargo_cap | 0,
      0
    );

    this.bonusSystemSlotCount = modules.reduce(
      (count: number, mod: any) => count + mod.system_slots | 0,
      0
    );

    this.bonusModuleSlotCount = systems.reduce(
      (count: number, sys: any) => count + sys.module_slots,
      0
    );

  }

  calculateSlotCounts() {
    this.systemSlotCount = this.systemsFormArray().value.reduce(
      (count: number, sys: any) => count + sys.slots,
      0
    );

    this.moduleSlotCount = this.modulesFormArray().value.reduce(
      (count: number, mod: any) => count + mod.slots,
      0
    );
  }

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private storage: StorageService
  ) {
    this.mechForm.get('chassis')?.valueChanges.subscribe((id) => {
      this.chassis = this.data.getChassis(id);
      this.patternList = this.chassis.patterns;

      if (this.mechForm.get('pattern')?.value > 1) {
        this.mechForm.get('pattern')?.setValue(0);
      }

      this.storage.setData('chassis', id);

      this.calculateValues();
    });

    this.mechForm.get('pattern')?.valueChanges.subscribe((id) => {
      this.storage.setData('pattern', id);

      if (id === 0) return;

      let pattern = this.getPattern(id);

      this.clearSystems(false);
      this.clearModules(false);

      pattern?.systems.forEach((sys: number) => this.addSystem(sys, false));
      pattern?.modules.forEach((mod: number) => this.addModule(mod, false));

      this.calculateValues();
    });

    const chassis = this.storage.getData('chassis');
    const pattern = this.storage.getData('pattern');
    const systems = storage.getData('systems');
    const modules = storage.getData('modules');

    console.log('chassis', chassis);
    console.log('pattern', pattern);
    console.log('systems', systems);
    console.log('modules', modules);

    if (chassis) {
      this.mechForm.get('chassis')?.setValue(chassis);
    }

    if (pattern) {
      this.mechForm.get('pattern')?.setValue(pattern);
    } else {
      systems.forEach((sys: number) => this.addSystem(sys, false));
      modules.forEach((mod: number) => this.addModule(mod, false));
    }
  }

  ngOnInit() {
  }

}
