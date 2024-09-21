import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Chassis, Pattern } from '../../types/mech';
import { CommonModule } from '@angular/common';
import { RollResultsComponent } from '../roll-results/roll-results.component';
import { ActionListComponent } from '../action-list/action-list.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';

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
export class MechChassisComponent implements OnInit {
  @Output() chassisChanged = new EventEmitter<Chassis | null>();

  chassisListByTechLevel: { [tl: string]: Chassis[] } =
    this.data.chassisListByTechLevel;

  techLevels: string[] = Object.keys(this.chassisListByTechLevel);

  chassisForm: FormGroup = this.fb.group({
    chassis: [0],
  });

  chassis: Chassis | null = null;

  locked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private storage: StorageService
  ){
    this.chassisForm.get('chassis')?.valueChanges.subscribe((id) => {
      console.log('mech-chassis component: chassis updated');
      this.chassis = this.data.getChassis(id) || null;
      console.log(this.chassis);

      this.storage.setData('chassis', id);

      this.chassisChanged.emit(this.chassis);
    });
  }

  ngOnInit() {
    this.loadChassis();
  }

  loadChassis() {
    const chassis = this.storage.getData('chassis');

    if (chassis) {
      this.chassisForm.get('chassis')?.setValue(chassis);
    }
  }

  forceDescriptionArray(desc: string | string[]): string[] {
    if (Array.isArray(desc)) {
      return desc;
    }

    return [desc];
  }
}
