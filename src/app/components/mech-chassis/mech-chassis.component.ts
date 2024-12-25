import { Component } from '@angular/core';
import { Chassis } from '../../types/mech';
import { CommonModule } from '@angular/common';
import { RollResultsComponent } from '../roll-results/roll-results.component';
import { ActionListComponent } from '../action-list/action-list.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CurrentMechService } from '../../services/current-mech.service';

@Component({
  selector: 'app-mech-chassis',
  standalone: true,
  imports: [
    ActionListComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RollResultsComponent
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
