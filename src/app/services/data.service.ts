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

  getChassis(id: number) {
    return this.chassisList.find((chas) => chas.id === id);
  }

  getSystem(id: number) {
    return this.systemList.find((sys) => sys.id === id);
  }

  getModule(id: number) {
    return this.moduleList.find((mod) => mod.id === id);
  }

  // Sort

  sortListByTechLevel(list: any[]) {
    return list.reduce(
      (acc: { [tl: number]: any[] }, item: any) => {
        if (item.tech_level in acc){
          acc[item.tech_level].push(item);
        } else {
          acc[item.tech_level] = [item];
        }
        
        return acc;
      }, {});
  }
}
