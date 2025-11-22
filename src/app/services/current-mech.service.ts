import { Injectable } from '@angular/core';

import type { Chassis, MechComponent, Pattern } from '../types/mech.d'
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentMechService {
  private patterns: BehaviorSubject<Pattern[]> =
    new BehaviorSubject<Pattern[]>([]);
  private pattern: BehaviorSubject<Pattern | null> =
    new BehaviorSubject<Pattern | null>(null);
  private patternIndex: BehaviorSubject<number | null> =
    new BehaviorSubject<number | null>(null);

  private chassis: BehaviorSubject<Chassis | null> =
    new BehaviorSubject<Chassis | null>(null);
  private systems: BehaviorSubject<MechComponent[]> =
    new BehaviorSubject<MechComponent[]>([]);
  private modules: BehaviorSubject<MechComponent[]> =
    new BehaviorSubject<MechComponent[]>([]);

  patterns$: Observable<Pattern[]> = this.patterns.asObservable();
  pattern$: Observable<Pattern | null> = this.pattern.asObservable();
  patternIndex$: Observable<number | null> = this.patternIndex.asObservable();

  chassis$: Observable<Chassis | null> = this.chassis.asObservable();
  systems$: Observable<MechComponent[]> = this.systems.asObservable();
  modules$: Observable<MechComponent[]> = this.modules.asObservable();

  constructor(
    private data: DataService,
    private storage: StorageService,
  ) {
    // Load stored data
    const patterns: Pattern[] = this.storage.getData('patterns');
    const patternIndex = this.storage.getData('patternIndex');

    const chassisId: number = this.storage.getData('chassisId');
    const systemIds: number[] = this.storage.getData('systemIds');
    const moduleIds: number[] = this.storage.getData('moduleIds');

    if (patterns) {
      this.patterns.next(patterns);
    }

    if (patternIndex !== null) {
      this.setPattern(patternIndex);
    } else {
      // If no pattern, check for components
      if (chassisId) {
        const chassis = this.data.getChassis(chassisId);
        this.chassis.next(chassis);
      }

      if (systemIds) {
        const systems: MechComponent[] = [];

        const ids = systemIds.sort((a, b) => a - b);

        ids.forEach((id) => {
          const system = this.data.getSystem(id);

          if (system) {
            systems.push(system);
          }
        });

        this.systems.next(systems);
      }

      if (moduleIds) {
        const modules: MechComponent[] = [];

        const ids = moduleIds.sort((a, b) => a - b);

        ids.forEach((id) => {
          const module = this.data.getModule(id);

          if (module) {
            modules.push(module);
          }
        });

        this.modules.next(modules);
      }
    }
  }

  setPatterns(patterns: Pattern[]) {
    this.storage.setData('patterns', patterns);

    this.patterns.next(patterns);
  }

  setPattern(index: number | null) {
    console.log('CurrentMechService.setPattern', index);

    if (index !== null && index < this.patterns.value.length) {
      const pattern: Pattern = this.patterns.value[index];

      this.storage.setData('patternIndex', index);

      this.setChassis(pattern.chassis, false);
      this.setSystems(pattern.systems, false);
      this.setModules(pattern.modules, false);

      this.pattern.next(pattern);
      this.patternIndex.next(index);
    } else {
      this.storage.removeData('patternIndex');

      this.pattern.next(null);
      this.patternIndex.next(null);
    }
  }

  setChassis(id: number, clearPattern: boolean = true) {
    const chassis = this.data.getChassis(id) || null;

    this.storage.setData('chassisId', id);

    this.chassis.next(chassis);

    if (clearPattern) {
      this.setPattern(null);
    }
  }

  setSystems(ids: number[], clearPattern: boolean = true) {
    const systems: MechComponent[] = [];

    console.log('setSystems input', ids);

    ids = ids.sort((a, b) => a - b);

    console.log('setSystems',  ids);

    ids.forEach((id)=>{
      const system = this.data.getSystem(id);

      if (system) {
        systems.push(system);
      }
    });

    this.storage.setData('systemIds', ids);

    this.systems.next(systems);

    if (clearPattern) {
      this.setPattern(null);
    }
  }

  setModules(ids: number[], clearPattern: boolean = true) {
    const modules: MechComponent[] = [];

    console.log('setModules input', ids);

    ids = ids.sort((a, b) => a - b);

    console.log('setModules',  ids);

    ids.forEach((id)=>{
      const module = this.data.getModule(id);

      if (module) {
        modules.push(module);
      }
    });

    this.storage.setData('moduleIds', ids);

    this.modules.next(modules);

    if (clearPattern) {
      this.setPattern(null);
    }
  }

  getPatterns() {
    return this.patterns.value;
  }

  getPattern() {
    return this.pattern.value;
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
