import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as chassisData from '../chassis.json';
import * as moduleData from '../modules.json';
import * as systemData from '../systems.json';

@Component({
  selector: 'app-mech-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './mech-viewer.component.html',
  styleUrl: './mech-viewer.component.css'
})
export class MechViewerComponent implements OnInit{
  techLevels = [1, 2, 3, 4, 5, 6];

  chassisList = chassisData.chassis;
  moduleList = moduleData.modules;
  systemList = systemData.systems;

  chassis: any = null;
  patternList: any[] = [];

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
    name: [''],
    pilot: [''],
    chassis: [0],
    pattern: [0],
    systems: this.fb.array([]),
    modules: this.fb.array([]),
  });

  // Getters

  getChassis(id: number) {
    return this.chassisList.find((chas) => chas.id === id);
  }

  getPattern(id: number) {
    return this.patternList.find((pat) => pat.id === id);
  }

  getSystem(id: number) {
    return this.systemList.find((sys) => sys.id === id);
  }

  getModule(id: number) {
    return this.moduleList.find((mod) => mod.id === id);
  }

  // Systems

  systemsFormArray() {
    return this.mechForm.get('systems') as FormArray;
  }

  addSystem(id: number, setCustom: boolean = true) {
    let system = this.getSystem(id);
    this.addToFormArray(this.systemsFormArray(), system, setCustom);
  }

  removeSystem(index: number, setCustom: boolean = true) {
    this.removeFromFormArray(this.systemsFormArray(), index, setCustom);
  }

  clearSystems(setCustom: boolean = true) {
    this.clearFormArray(this.systemsFormArray(), setCustom);
  }

  // Modules

  modulesFormArray() {
    return this.mechForm.get('modules') as FormArray;
  }

  addModule(id: number, setCustom: boolean = true) {
    let module = this.getModule(id);
    this.addToFormArray(this.modulesFormArray(), module, setCustom);
  }

  removeModule(index: number, setCustom: boolean = true) {
    this.removeFromFormArray(this.modulesFormArray(), index, setCustom);
  }

  clearModules(setCustom: boolean = true) {
    this.clearFormArray(this.modulesFormArray(), setCustom);
  }

  // FormArray functions

  addToFormArray(formArray: FormArray, item: any, setCustom: boolean = true) {
    if (setCustom) {
      this.mechForm.get('pattern')?.setValue(0);
    }

    formArray.push(
      this.fb.group({
        'id': item.id,
        'name': item?.name,
        'tech_level': item?.tech_level,
        'slots': item?.slots,
        'salvage_value': item?.salvage_value
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
    private fb: FormBuilder
  ) {
    this.mechForm.get('chassis')?.valueChanges.subscribe((id) => {
      this.chassis = this.getChassis(id);
      this.patternList = this.chassis.patterns;
      if (this.mechForm.get('pattern')?.value > 1) {
        this.mechForm.get('pattern')?.setValue(0);
      }

      this.calculateValues();
    });

    this.mechForm.get('pattern')?.valueChanges.subscribe((id) => {
      if (id === 0) return;

      let pattern = this.getPattern(id);

      this.clearSystems(false);
      this.clearModules(false);

      pattern.systems.forEach((sys: number) => this.addSystem(sys, false));
      pattern.modules.forEach((sys: number) => this.addModule(sys, false));

      this.calculateValues();
    });
  }

  ngOnInit() {
  }

}
