import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';

import { CurrentMechService } from '../../services/current-mech.service';
import { CardComponent } from "../elements/card/card.component";

@Component({
  selector: 'app-mech-status',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent
],
  templateUrl: './mech-status.component.html',
  styleUrl: './mech-status.component.css'
})
export class MechStatusComponent implements OnInit{
  structure: number = 0;
  bonusStructure: number = 0;

  energy: number = 0;
  bonusEnergy: number = 0;

  heat: number = 0;
  bonusHeat: number = 0;

  constructor(
    private currentMech: CurrentMechService
  ){

  }

  ngOnInit() {
    // Chassis subscription
    this.currentMech.chassis$.subscribe(
      (chassis) => {
        if (chassis) {
          this.structure = chassis.structure_pts;
          this.energy = chassis.energy_pts;
          this.heat = chassis.heat_cap;
        } else {
          this.structure = 0;
          this.energy = 0;
          this.heat = 0;
        }
      }
    );

    // Systems and Modules subscriptions
    combineLatest([
      this.currentMech.systems$,
      this.currentMech.modules$
    ]).subscribe(
      ([systems, modules]) => {
        const components = [...systems, ...modules];

        this.bonusStructure = components.reduce(
          (count: number, comp: any) => count + (comp.structure_pts || 0),
          0
        );

        this.bonusEnergy = components.reduce(
          (count: number, comp: any) => count + (comp.energy_pts || 0),
          0
        );

        this.bonusHeat = components.reduce(
          (count: number, comp: any) => count + (comp.heat_cap || 0),
          0
        );
      }
    );
  }

}
