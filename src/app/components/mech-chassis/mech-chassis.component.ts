import { Component, OnInit } from '@angular/core';
import { Chassis, MechComponent, Pattern } from '../../types/mech';
import { CommonModule } from '@angular/common';
import { RollResultsComponent } from '../roll-results/roll-results.component';
import { ActionListComponent } from '../action-list/action-list.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CurrentMechService } from '../../services/current-mech.service';
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
  chassisListByTechLevel: { [tl: string]: Chassis[] } =
    this.data.chassisListByTechLevel;

  techLevels: string[] = Object.keys(this.chassisListByTechLevel);

  chassisForm: FormGroup = this.fb.group({
    chassis: [0]
  });

  patternForm: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });

  chassis: Chassis | null = null;
  patterns: Pattern[] = [];
  patternChassis: (Chassis | null)[] = [];

  constructor(
    private currentMech: CurrentMechService,
    private data: DataService,
    private fb: FormBuilder,
    private storage: StorageService
  ){
    this.currentMech.chassis$.subscribe((chassis) => {
      if (chassis) {
        this.chassisForm.get('chassis')?.setValue(
          chassis?.id, { emitEvent: false});

        this.chassis = chassis;
        console.log(this.chassis)
      }
    });

    this.chassisForm.get('chassis')?.valueChanges.subscribe((id) => {
      this.currentMech.setChassis(id);
    });

    this.patternForm.get('name')?.valueChanges.subscribe((name) => {
      this.storage.setData('pattern', name);
    });
  }

  ngOnInit() {
    const pattern = this.storage.getData('pattern');
    const patterns = this.storage.getData('patterns');

    if (pattern) {
      this.patternForm.get('name')?.setValue(pattern);
    }

    if (patterns) {
      this.patterns = patterns;
      this.patternChassis = this.patterns.map(
        (p) => this.data.getChassis(p.chassis));
    }
  }

  savePattern() {
    const name = this.patternForm.get('name')?.value;
    const chassis = this.chassis?.id;

    if (name && chassis) {
      const pattern = {
        'name': name,
        'chassis': chassis,
        'systems': this.currentMech.getSystems().map((s) => s.id),
        'modules': this.currentMech.getModules().map((m) => m.id),
      };

      this.patterns.push(pattern);
      this.patternChassis.push(this.chassis);

      this.storage.setData('patterns', this.patterns);
    }
  }

  deletePattern(index: number) {
    this.patterns.splice(index, 1);
    this.patternChassis.splice(index, 1);

    this.storage.setData('patterns', this.patterns);

    if (this.patterns.length === 0) {
      console.log("no more saved patterns")
      // var modal = bootstrap.Modal.getInstance(document.getElementById('savedPatternsModal'));
      // modal?.hide();
    }
  }

  loadPattern(pattern: Pattern) {
    this.patternForm.get('name')?.setValue(pattern.name);

    this.currentMech.setPattern(pattern);
  }
}
