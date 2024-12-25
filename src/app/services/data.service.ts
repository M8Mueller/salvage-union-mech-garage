import { Injectable } from '@angular/core';

import * as chassisData from '../data/chassis.json';
import * as moduleData from '../data/modules.json';
import * as systemData from '../data/systems.json';

import type { Chassis, MechComponent, Pattern } from '../types/mech.d';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  chassisList: Chassis[] = chassisData.chassis;
  moduleList: MechComponent[] = moduleData.modules;
  systemList: MechComponent[] = systemData.systems;

  chassisListByTechLevel: {
    [tl: number]: Chassis[]
  } = this.sortListByTechLevel(this.chassisList);

  moduleListByTechLevel: {
    [tl: number]: MechComponent[]
  } = this.sortListByTechLevel(this.moduleList);

  systemListByTechLevel: {
    [tl: number]: MechComponent[]
  } = this.sortListByTechLevel(this.systemList);

  // Get

  getComponent(id: number, key: string) {
    switch(key) {
      case "modules": {
        return this.getModule(id);
      }
      case "systems": {
        return this.getSystem(id);
      }
      default: {
        return null;
      }
    }
  }

  getChassis(id: number) {
    return this.chassisList.find((chas) => chas.id === id) || null;
  }

  getSystem(id: number) {
    return this.systemList.find((sys) => sys.id === id) || null;
  }

  getModule(id: number) {
    return this.moduleList.find((mod) => mod.id === id) || null;
  }

  // Sort

  sortListByTechLevel(list: any[]) {
    return list.sort(
      (a: any, b: any) => a.name.localeCompare(b.name)
    ).reduce(
      (acc: { [tl: number]: any[] }, item: any) => {
        if (item.tech_level in acc){
          acc[item.tech_level].push(item);
        } else {
          acc[item.tech_level] = [item];
        }

        return acc;
      }, {}
    );
  }
}
