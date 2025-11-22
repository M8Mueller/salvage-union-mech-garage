import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RollTheDieComponent } from '../elements/roll-the-die/roll-the-die.component';
import { ActionListComponent } from '../elements/action-list/action-list.component';

import { CurrentMechService } from '@salvage-union-app/services/current-mech.service';
import { DataService } from '@salvage-union-app/services/data.service';

import { Chassis } from '@salvage-union-app/types/mech';
import { CardComponent } from '../elements/card/card.component';
import { MechPatternComponent } from "../mech-pattern/mech-pattern.component";
import { IconComponent } from '../elements/icon/icon.component';

@Component({
  selector: 'app-mech-chassis',
  standalone: true,
  imports: [
    ActionListComponent,
    CardComponent,
    CommonModule,
    FormsModule,
    IconComponent,
    ReactiveFormsModule,
    RollTheDieComponent,
    MechPatternComponent
],
  templateUrl: './mech-chassis.component.html',
  styleUrl: './mech-chassis.component.css'
})
export class MechChassisComponent {
  chassisListByTechLevel: { [tl: string]: Chassis[] } =
    this.data.chassisListByTechLevel;

  techLevels: string[] = Object.keys(this.chassisListByTechLevel);

  chassisForm: FormGroup = this.fb.group({
    chassis: [0]
  });

  chassis: Chassis | null = null;

  constructor(
    private currentMech: CurrentMechService,
    private data: DataService,
    private fb: FormBuilder
  ){

    this.currentMech.chassis$.subscribe((chassis) => {
      if (chassis) {
        this.chassisForm.get('chassis')?.setValue(
          chassis?.id, { emitEvent: false}
        );

        this.chassis = chassis;
      }
    });

    this.chassisForm.get('chassis')?.valueChanges.subscribe((id) => {
      this.currentMech.setChassis(id);
    });
  }
}
