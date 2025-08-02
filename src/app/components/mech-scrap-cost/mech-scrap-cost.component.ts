import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrentMechService } from '../../services/current-mech.service';
import { CardComponent } from "../elements/card/card.component";


@Component({
  selector: 'app-mech-scrap-cost',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent
],
  templateUrl: './mech-scrap-cost.component.html',
  styleUrl: './mech-scrap-cost.component.css'
})
export class MechScrapCostComponent implements OnInit {
  chassisScrapCost: number = 0;
  systemsScrapCost: number = 0;
  modulesScrapCost: number = 0;

  totalScrapCost: number = 0;

  ngOnInit() {
    this.currentMech.chassis$.subscribe((chassis) => {
      this.chassisScrapCost = 0;

      if (chassis) {
        this.chassisScrapCost += chassis.tech_level * chassis.salvage_value;
      }

      this.calculateTotalScrapCost();
    });

    this.currentMech.systems$.subscribe((systems) => {
      this.systemsScrapCost = 0;

      systems.forEach((comp) => {
        this.systemsScrapCost += comp.tech_level * comp.salvage_value;
      });

      this.calculateTotalScrapCost();
    });

    this.currentMech.modules$.subscribe((modules) => {
      this.modulesScrapCost = 0;

      modules.forEach((comp) => {
        this.modulesScrapCost += comp.tech_level * comp.salvage_value;
      });

      this.calculateTotalScrapCost();
    });
  }

  calculateTotalScrapCost() {
    this.totalScrapCost = (
      this.chassisScrapCost +
      this.systemsScrapCost +
      this.modulesScrapCost
    );
  }

  constructor(
    private currentMech: CurrentMechService
  ) {
  }

}
