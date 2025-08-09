import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ActionListComponent } from '../elements/action-list/action-list.component';
import { EpTagComponent } from '../elements/ep-tag/ep-tag.component';
import { TraitListComponent } from '../elements/trait-list/trait-list.component';

import { MechComponent } from '@salvage-union-app/types/mech';

@Component({
  selector: 'app-mech-component-browser',
  standalone: true,
  imports: [
    ActionListComponent,
    CommonModule,
    EpTagComponent,
    ReactiveFormsModule,
    TraitListComponent
  ],
  templateUrl: './mech-component-browser.component.html',
  styleUrl: './mech-component-browser.component.css'
})
export class MechComponentBrowserComponent implements OnChanges, OnInit {
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

  setFilter(value: string) {
    const search = this.filterForm.get('search');

    if (search?.value === value) {
      this.clearFilter();
    } else {
      search?.setValue(value);
    }
  }

  clearFilter() {
    this.filterForm.get('search')?.setValue(null);
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
