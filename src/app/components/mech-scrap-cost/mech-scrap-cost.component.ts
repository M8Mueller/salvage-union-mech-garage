import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrentMechService } from '../../services/current-mech.service';
import { CardComponent } from "../elements/card/card.component";

interface LeveledValue {
  [level: number]: number,
};

function newLeveledValue(levels: number[]): LeveledValue {
  let value: LeveledValue = {};

  for (const level of levels) {
    value[level] = 0;
  }

  return value;
}


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
  levels = [1, 2, 3, 4, 5, 6];

  leveledChassisScrapCost: LeveledValue = newLeveledValue(this.levels);
  leveledSystemsScrapCost: LeveledValue = newLeveledValue(this.levels);
  leveledModulesScrapCost: LeveledValue = newLeveledValue(this.levels);

  chassisScrapCost: number = 0;
  systemsScrapCost: number = 0;
  modulesScrapCost: number = 0;

  totalScrapCost: number = 0;

  ngOnInit() {
    this.currentMech.chassis$.subscribe((chassis) => {
      this.chassisScrapCost = 0;
      this.leveledChassisScrapCost = newLeveledValue(this.levels);

      if (chassis) {
        this.chassisScrapCost += chassis.tech_level * chassis.salvage_value;
        this.leveledChassisScrapCost[chassis?.tech_level] = chassis.salvage_value;
      }

      this.calculateTotalScrapCost();
    });

    this.currentMech.systems$.subscribe((systems) => {
      this.systemsScrapCost = 0;
      this.leveledSystemsScrapCost = newLeveledValue(this.levels);

      systems.forEach((comp) => {
        this.systemsScrapCost += comp.tech_level * comp.salvage_value;
        this.leveledSystemsScrapCost[comp.tech_level] += comp.salvage_value;
      });

      this.calculateTotalScrapCost();
    });

    this.currentMech.modules$.subscribe((modules) => {
      this.modulesScrapCost = 0;
      this.leveledModulesScrapCost = newLeveledValue(this.levels);

      modules.forEach((comp) => {
        this.modulesScrapCost += comp.tech_level * comp.salvage_value;
        this.leveledModulesScrapCost[comp.tech_level] += comp.salvage_value;
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
