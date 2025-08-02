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

  patterns: Pattern[] = [];
  patternChassis: (Chassis | null)[] = [];

  patternIndex: number | null = null;
  pattern: Pattern | null = null;

  chassis: Chassis | null = null;
  systems: MechComponent[] = [];
  modules: MechComponent[] = [];

  currentPattern: Pattern | null = null;
  currentChassis: Chassis | null = null;
  currentSystems: MechComponent[] = [];
  currentModules: MechComponent[] = [];

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
      this.currentPattern = index !== null ? this.patterns[index] : null;
      this.selectPattern(index);
    });

    this.currentMech.chassis$.subscribe((chassis) => {
      this.currentChassis = chassis;
    });

    this.currentMech.systems$.subscribe((systems) => {
      this.currentSystems = systems;
    });

    this.currentMech.modules$.subscribe((modules) => {
      this.currentModules = modules;
    });
  }

  selectPattern(index: number | null) {
    this.patternIndex = index;

    if (index !== null) {
      const pattern = this.patterns[index];

      this.pattern = pattern;
      this.chassis = this.data.getChassis(pattern.chassis);
      this.systems = pattern.systems.flatMap((s) => this.data.getSystem(s) || []);
      this.modules = pattern.modules.flatMap((m) => this.data.getModule(m) || []);

      this.patternForm.get('name')?.setValue(pattern.name);

    } else {
      this.pattern = null;
      this.chassis = null;
      this.systems = [];
      this.modules = [];
    }
  }

  applyPattern() {
    this.currentMech.setPattern(this.patternIndex);
  }

  updatePattern(index: number) {
    let name = this.patternForm.get('name')?.value;
    const chassis = this.currentMech.getChassis();

    if (!name) {
      name = this.patterns[index].name;
    }

    if (name && chassis) {
      const pattern = {
        'name': name,
        'chassis': chassis.id,
        'systems': this.currentMech.getSystems().map((s) => s.id),
        'modules': this.currentMech.getModules().map((m) => m.id),
      };

      this.patterns.splice(index, 1, pattern);
      this.patternChassis.splice(index, 1, this.data.getChassis(pattern.chassis));

      this.currentMech.setPatterns(this.patterns);
      this.currentMech.setPattern(index);
    }
  }

  newPattern() {
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

      const newIndex = this.patterns.length - 1;

      this.currentMech.setPattern(newIndex);
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
}
