import { Component } from '@angular/core';
import { Chassis, MechComponent, Pattern } from '../../types/mech';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CurrentMechService } from '../../services/current-mech.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-mech-pattern',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './mech-pattern.component.html',
  styleUrl: './mech-pattern.component.css'
})
export class MechPatternComponent {
  patternForm: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });

  patternIndex: number | null = null;
  pattern: Pattern | null = null;
  patterns: Pattern[] = [];
  patternChassis: (Chassis | null)[] = [];

  chassis: Chassis | null = null;
  systems: MechComponent[] = [];
  modules: MechComponent[] = [];

  constructor(
    private currentMech: CurrentMechService,
    private data: DataService,
    private storage: StorageService,
    private fb: FormBuilder
  ){
    const patterns = this.currentMech.getPatterns();

    if (patterns) {
      this.patterns = patterns;
      this.patternChassis = this.patterns.map(
        (p) => this.data.getChassis(p.chassis));
    }

    this.currentMech.patternIndex$.subscribe((index) => {
      if (index !== null) {
        const pattern = this.patterns[index];
        this.pattern = pattern;
        this.patternIndex = index;

        this.patternForm.get('name')?.setValue(
          pattern?.name, { emitEvent: false}
        );
      } else {
        this.pattern = null;
        this.patternIndex = null;

        this.patternForm.get('name')?.setValue(
          '', { emitEvent: false}
        );
      }
    });

    this.currentMech.chassis$.subscribe((chassis) => {
      this.chassis = chassis;
    });

    this.currentMech.systems$.subscribe((systems) => {
      this.systems = systems;
    });

    this.currentMech.modules$.subscribe((modules) => {
      this.modules = modules;
    });
  }

  savePattern() {
    const name = this.patternForm.get('name')?.value;
    const chassis = this.currentMech.getChassis();

    if (name && chassis) {
      const pattern = {
        'name': name,
        'chassis': chassis.id,
        'systems': this.currentMech.getSystems().map((s) => s.id),
        'modules': this.currentMech.getModules().map((m) => m.id),
      };

      this.patterns.push(pattern);
      this.patternChassis.push(chassis);

      this.currentMech.setPatterns(this.patterns);
      this.currentMech.setPattern(this.patterns.length - 1);
    }
  }

  deletePattern(index: number) {
    this.patterns.splice(index, 1);
    this.patternChassis.splice(index, 1);

    this.currentMech.setPatterns(this.patterns);

    if (this.patternIndex !== null) {
      if (this.patternIndex === index) {
        this.currentMech.setPattern(null);
      } else if (this.patternIndex > index) {
        this.currentMech.setPattern(this.patternIndex - 1);
      }
    }
  }

  loadPattern(index: number | null) {
    this.currentMech.setPattern(index);
  }

  clearData() {
    this.storage.clearData();
  }

}
