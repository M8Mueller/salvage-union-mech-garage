import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { MechComponent } from '@salvage-union-app/types/mech';

import { CurrentMechService } from '@salvage-union-app/services/current-mech.service';
import { DataService } from '@salvage-union-app/services/data.service';

import { MechComponentBrowserComponent } from '../mech-component-browser/mech-component-browser.component';
import { CardComponent } from '../elements/card/card.component';
import { TraitListComponent } from '../elements/trait-list/trait-list.component';
import { IconComponent } from '../elements/icon/icon.component';
import { EpTagComponent } from '../elements/ep-tag/ep-tag.component';
import { ActionListComponent } from '../elements/action-list/action-list.component';
import { RollTheDieComponent } from '../elements/roll-the-die/roll-the-die.component';

@Component({
  selector: 'app-mech-systems',
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
  templateUrl: './mech-systems.component.html',
  styleUrl: './mech-systems.component.css'
})
export class MechSystemsComponent implements OnInit {
  slots: number = 0;
  bonusSlots: number = 0;

  @Output() componentsChanged = new EventEmitter<MechComponent[]>();

  systemList: { [tl: string]: MechComponent[] } =
    this.data.systemListByTechLevel;

  techLevels: string[] = Object.keys(this.systemList);

  systemIds: number[] = [];
  systems: MechComponent[] = [];

  systemIndex: number = -1;
  system: MechComponent | null = null;

  usedSlots: number = 0;

  constructor(
    private currentMech: CurrentMechService,
    private data: DataService,
  ){
    // Chassis subscription - base slots
    this.currentMech.chassis$.subscribe((chassis) => {
      if (chassis) {
        this.slots = chassis.system_slots;
      }
    });

    // Modules subscription - bonus slots
    this.currentMech.modules$.subscribe((components) => {
      this.bonusSlots = components.reduce(
        (count: number, component: any) => count + (component.system_slots || 0),
        0
      );
    });

    // Systems subscription - used slots
    this.currentMech.systems$.subscribe((systems) => {
      this.systems = systems;
      this.systemIds = systems.map((s) => s.id);
      this.countSlots();
    });
  }

  ngOnInit() {
    const modal = document.getElementById('systemInfoModal');

    if (modal) {
      modal.addEventListener('show.bs.modal', event => {
        const button = (event as MouseEvent).relatedTarget as HTMLElement;

        if (button) {
          const index = button.getAttribute('data-bs-index');

          if (index) {
            this.systemIndex = Number(index);
            this.system = this.systems[Number(index)];
          }
        }
      });
    }
  }

  cycleSystem(direction: number) {
    let index = this.systemIndex + direction;

    if (index < 0) {
      index = this.systems.length - 1;
    } else if (index >= this.systems.length) {
      index = 0;
    }

    this.system = this.systems[index];
    this.systemIndex = index;
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
