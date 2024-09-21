import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MechComponent } from '../../types/mech';

import { ActionListComponent } from '../action-list/action-list.component';
import { EpTagComponent } from '../ep-tag/ep-tag.component';
import { TraitListComponent } from '../trait-list/trait-list.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mech-component-picker',
  standalone: true,
  imports: [
    ActionListComponent,
    CommonModule,
    EpTagComponent,
    ReactiveFormsModule,
    TraitListComponent
  ],
  templateUrl: './mech-component-picker.component.html',
  styleUrl: './mech-component-picker.component.css'
})
export class MechComponentPickerComponent implements OnChanges, OnInit {
  @Input() componentList: { [tl: string]: MechComponent[] } = {};
  @Input() availableSlots: number = 0;

  @Output() componentSelected: EventEmitter<number> = new EventEmitter<number>();

  filteredComponentList: { [tl: string]: MechComponent[] } = {};

  techLevels: string[] = [];

  filterForm: FormGroup = this.fb.group({
    search: [],
  });

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.techLevels = Object.keys(this.componentList);

    this.filterForm.get('search')?.valueChanges.subscribe((search) => {
      this.filterComponents(search);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const search = this.filterForm.get('search')?.value || null;
    this.filterComponents(search);
  }

  filterComponents(search: string | null = null) {
    if (search) {
      const filteredComponentList: { [tl: string]: MechComponent[] } = {};
      this.techLevels.forEach((tl) => {
        const matches: MechComponent[] = [];

        this.componentList[tl].forEach((component) => {
          const searchLower = search.toLowerCase();

          if (
            component.name.toLowerCase().includes(searchLower) ||
            component.traits?.some((trait) => trait.toLowerCase().includes(searchLower))
          ) {
            matches.push(component);
          }
        });

        filteredComponentList[tl] = matches;
      });

      this.filteredComponentList = filteredComponentList;
    } else {
      this.filteredComponentList = this.componentList;
    }
  }

  selectComponent(id: number) {
    this.componentSelected.emit(id);
  }

}
