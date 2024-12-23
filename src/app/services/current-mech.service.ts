import { Injectable } from '@angular/core';

import type { Chassis, MechComponent, Pattern } from '../types/mech.d'
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentMechService {
  private chassis: BehaviorSubject<Chassis | null> =
    new BehaviorSubject<Chassis | null>(null);

  private systems: BehaviorSubject<MechComponent[]> =
    new BehaviorSubject<MechComponent[]>([]);

  private modules: BehaviorSubject<MechComponent[]> =
    new BehaviorSubject<MechComponent[]>([]);

  chassis$: Observable<Chassis | null> = this.chassis.asObservable();
  systems$: Observable<MechComponent[]> = this.systems.asObservable();
  modules$: Observable<MechComponent[]> = this.modules.asObservable();

  constructor(
    private data: DataService,
    private storage: StorageService,
  ) {
    const chassis = this.storage.getData('chassis');
    const systems = this.storage.getData('systems');
    const modules = this.storage.getData('modules');

    if (chassis) {
      this.chassis.next(chassis);
    }

    if (systems) {
      this.systems.next(systems);
    }

    if (modules) {
      this.modules.next(modules);
    }
  }

  setPattern(pattern: Pattern) {
    this.setChassis(pattern.chassis);
    this.setSystems(pattern.systems);
    this.setModules(pattern.modules);
  }

  setChassis(id: number) {
    const chassis = this.data.getChassis(id) || null;

    this.storage.setData('chassis', chassis);

    this.chassis.next(chassis);
  }

  setSystems(ids: number[]) {
    const systems: MechComponent[] = [];

    ids.forEach((id)=>{
      const system = this.data.getSystem(id);

      if (system) {
        systems.push(system);
      }
    });

    this.storage.setData('systems', systems);

    this.systems.next(systems);
  }

  setModules(ids: number[]) {
    const modules: MechComponent[] = [];

    ids.forEach((id)=>{
      const module = this.data.getModule(id);

      if (module) {
        modules.push(module);
      }
    });

    this.storage.setData('modules', modules);

    this.modules.next(modules);
  }

  getChassis() {
    return this.chassis.value;
  }

  getSystems() {
    return this.systems.value;
  }

  getModules() {
    return this.modules.value;
  }

}
