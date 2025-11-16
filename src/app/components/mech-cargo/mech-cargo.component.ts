import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { combineLatest } from 'rxjs';

import { CurrentMechService } from '@salvage-union-app/services/current-mech.service';
import { CardComponent } from "../elements/card/card.component";
import { IconComponent } from '../elements/icon/icon.component';

@Component({
  selector: 'app-mech-cargo',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    IconComponent
],
  templateUrl: './mech-cargo.component.html',
  styleUrl: './mech-cargo.component.css'
})
export class MechCargoComponent implements OnInit {
  cargo: number = 0;
  bonusCargo: number = 0;

  constructor(
    private currentMech: CurrentMechService
  ){

  }

  ngOnInit() {
    // Chassis subscription
    this.currentMech.chassis$.subscribe(
      (chassis) => {
        if (chassis) {
          this.cargo = chassis.cargo_cap;
        } else {
          this.cargo = 0;
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

        this.bonusCargo = components.reduce(
          (count: number, comp: any) => count + (comp.cargo_cap || 0),
          0
        );
      }
    );
  }
}
