import { Component } from '@angular/core';
import { Chassis, MechComponent, Pattern } from '../../types/mech';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CurrentMechService } from '../../services/current-mech.service';
import { StorageService } from '../../services/storage.service';
import { IconComponent } from '../elements/icon/icon.component';

@Component({
  selector: 'app-mech-pattern',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
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
      if (index !== null) {
        this.currentPattern = this.patterns[index];
        this.patternForm.get('name')?.setValue(this.currentPattern.name);
      } else {
        this.currentPattern = null;
        this.patternForm.get('name')?.setValue('');
      }
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

  togglePattern(index: number) {
    if (index === this.patternIndex) {
      this.selectPattern(null);
    } else {
      this.selectPattern(index);
    }
  }

  selectPattern(index: number | null) {
    if (index === null) {
      this.patternIndex = null;
      this.pattern = null;
      this.chassis = null;
      this.systems = [];
      this.modules = [];

      return;
    } else {
      this.patternIndex = index;
      const pattern = this.patterns[index];

      this.pattern = pattern;
      this.chassis = this.data.getChassis(pattern.chassis);
      this.systems = pattern.systems.flatMap((s) => this.data.getSystem(s) || []);
      this.modules = pattern.modules.flatMap((m) => this.data.getModule(m) || []);
    }
  }

  getScrapCost(pattern: Pattern): number {
    let total = 0;

    const chassis = this.data.getChassis(pattern.chassis);
    const systems = pattern.systems.flatMap((s) => this.data.getSystem(s) || []);
    const modules = pattern.modules.flatMap((m) => this.data.getModule(m) || []);

    if (chassis) {
      total += chassis.salvage_value * chassis.tech_level;
    }

    systems.forEach((system) => {
      total += system.salvage_value * system.tech_level;
    });

    modules.forEach((module) => {
      total += module.salvage_value * module.tech_level;
    });

    return total;
  }

  applyPattern(index: number) {
    this.currentMech.setPattern(index);
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
