import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CurrentMechService } from '@salvage-union-app/services/current-mech.service';
import { DataService } from '@salvage-union-app/services/data.service';

import { MechComponent } from '@salvage-union-app/types/mech';

import { MechComponentBrowserComponent } from '../mech-component-browser/mech-component-browser.component';
import { CardComponent } from '../elements/card/card.component';
import { EpTagComponent } from '../elements/ep-tag/ep-tag.component';
import { TraitListComponent } from '../elements/trait-list/trait-list.component';
import { ActionListComponent } from '../elements/action-list/action-list.component';
import { RollTheDieComponent } from '../elements/roll-the-die/roll-the-die.component';
import { IconComponent } from '../elements/icon/icon.component';

@Component({
  selector: 'app-mech-modules',
  standalone: true,
  imports: [
    ActionListComponent,
    CardComponent,
    CommonModule,
    EpTagComponent,
    IconComponent,
    MechComponentBrowserComponent,
    RollTheDieComponent,
    TraitListComponent
  ],
  templateUrl: './mech-modules.component.html',
  styleUrl: './mech-modules.component.css'
})
export class MechModulesComponent implements OnInit {
  slots: number = 0;
  bonusSlots: number = 0;

  @Output() componentsChanged = new EventEmitter<MechComponent[]>();

  moduleList: { [tl: string]: MechComponent[] } =
    this.data.moduleListByTechLevel;

  techLevels: string[] = Object.keys(this.moduleList);

  moduleIds: number[] = [];
  modules: MechComponent[] = [];

  moduleIndex: number = -1;
  module: MechComponent | null = null;

  usedSlots: number = 0;

  quickFilters = [
    { label: 'Hacking', value: 'Hacking' },
    { label: 'Scanner', value: 'Scanner' },
    { label: 'Optics', value: 'Optics' },
  ];

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

  ngOnInit() {
    const modal = document.getElementById('moduleInfoModal');

    if (modal) {
      modal.addEventListener('show.bs.modal', event => {
        const button = (event as MouseEvent).relatedTarget as HTMLElement;

        if (button) {
          const index = button.getAttribute('data-bs-index');

          if (index) {
            this.module = this.modules[Number(index)];
          }
        }
      });
    }
  }

  cycleModule(direction: number) {
    let index = this.moduleIndex + direction;

    if (index < 0) {
      index = this.modules.length - 1;
    } else if (index >= this.modules.length) {
      index = 0;
    }

    this.module = this.modules[index];
    this.moduleIndex = index;
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
