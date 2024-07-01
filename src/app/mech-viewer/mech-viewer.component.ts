import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, pipe } from 'rxjs';

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
  mechForm: FormGroup = this.fb.group({
    name: [''],
    pilot: [''],
    chassis: [0],
    pattern: [0],
    systems: this.fb.array([]),
    modules: this.fb.array([]),
  });

  systemsFormArray() {
    return this.mechForm.get('systems') as FormArray;
  }

  modulesFormArray() {
    return this.mechForm.get('modules') as FormArray;
  }

  chassis: any = null;
  systemSlotCount: number = 0;
  moduleSlotCount: number = 0;

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

  chassisList = [
    {
      'id': 1,
      'name': 'Mule',
      'structure_pts': 15,
      'energy_pts': 6,
      'heat_cap': 10,
      'system_slots': 9,
      'module_slots': 2,
      'cargo_cap': 6,
      'tech_level': 1,
      'salvage_value': 9,
      'ability': 'Heavily Armoured Chassis'
    },
    {
      'id': 2,
      'name': 'Mazona',
      'structure_pts': 5,
      'energy_pts': 10,
      'heat_cap': 6,
      'system_slots': 7,
      'module_slots': 3,
      'cargo_cap': 6,
      'tech_level': 1,
      'salvage_value': 4,
      'ability': 'Hover Drone'
    },
  ];

  getChassisStats(id: number) {
    return this.chassisList.find((chas) => chas.id === id);
  }

  systemList = [
    {
      'id': 1,
      'name': '.50 Cal Machine Gun',
      'tech_level': 1,
      'slots': 2,
      'salvage_value': 2
    },
    {
      'id': 2,
      'name': 'Armour Plating',
      'tech_level': 1,
      'slots': 2,
      'salvage_value': 1
    },
    {
      'id': 3,
      'name': 'Cargo Pod',
      'tech_level': 1,
      'slots': 1,
      'salvage_value': 1
    },
    {
      'id': 4,
      'name': 'Chainsaw Arm',
      'tech_level': 1,
      'slots': 1,
      'salvage_value': 1
    }
  ]

  getSystemStats(id: number) {
    return this.systemList.find((sys) => sys.id === id);
  }

  addSystem(id: number) {
    let system = this.getSystemStats(id);

    this.systemsFormArray().push(this.fb.group({
      'id': id,
      'name': system?.name,
      'tech_level': system?.tech_level,
      'slots': system?.slots,
      'salvage_value': system?.salvage_value
    }));

    this.calculateScrapCost();
    this.calculateSlotCounts();
  }

  removeSystem(index: number) {
    this.systemsFormArray().removeAt(index);

    this.calculateScrapCost();
    this.calculateSlotCounts();
  }

  moduleList = [
    {
      'id': 1,
      'name': 'Comms Module',
      'tech_level': 1,
      'slots': 1,
      'salvage_value': 1
    },
    {
      'id': 2,
      'name': 'Equipment Locker',
      'tech_level': 1,
      'slots': 1,
      'salvage_value': 1
    },
    {
      'id': 3,
      'name': 'Firewall',
      'tech_level': 1,
      'slots': 1,
      'salvage_value': 2
    },
    {
      'id': 4,
      'name': 'Personal Recreation Device',
      'tech_level': 1,
      'slots': 1,
      'salvage_value': 1
    }
  ]

  getModuleStats(id: number) {
    return this.moduleList.find((mod) => mod.id === id);
  }

  addModule(id: number) {
    let module = this.getModuleStats(id);

    this.modulesFormArray().push(this.fb.group({
      'id': id,
      'name': module?.name,
      'tech_level': module?.tech_level,
      'slots': module?.slots,
      'salvage_value': module?.salvage_value
    }));

    this.calculateScrapCost();
    this.calculateSlotCounts();
  }

  removeModule(index: number) {
    this.modulesFormArray().removeAt(index);

    this.calculateScrapCost();
    this.calculateSlotCounts();
  }

  techLevels = [1, 2, 3, 4, 5, 6]
  scrapCost: { [id: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
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

  constructor(
    private fb: FormBuilder
  ) {
    this.mechForm.get('chassis')?.valueChanges.pipe(
      debounceTime(500),
    ).subscribe((id) => {
      this.chassis = this.getChassisStats(id);

      this.calculateScrapCost();
      this.calculateSlotCounts();
    });
  }

  ngOnInit() {
  }

}
