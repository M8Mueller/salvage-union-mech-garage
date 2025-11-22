import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ActionListComponent } from '../elements/action-list/action-list.component';
import { EpTagComponent } from '../elements/ep-tag/ep-tag.component';
import { IconComponent } from '../elements/icon/icon.component';
import { RollTheDieComponent } from '../elements/roll-the-die/roll-the-die.component';
import { TraitListComponent } from '../elements/trait-list/trait-list.component';

import { MechComponent, QuickFilter } from '@salvage-union-app/types/mech';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-mech-component-browser',
  standalone: true,
  imports: [
    ActionListComponent,
    CommonModule,
    EpTagComponent,
    IconComponent,
    ReactiveFormsModule,
    RollTheDieComponent,
    TraitListComponent
  ],
  templateUrl: './mech-component-browser.component.html',
  styleUrl: './mech-component-browser.component.css'
})
export class MechComponentBrowserComponent implements OnChanges, OnInit {
  @Input() prefix: string = '';
  @Input() componentList: { [tl: string]: MechComponent[] } = {};
  @Input() components: number[] = [];
  @Input() availableSlots: number = 0;
  @Input() extraQuickFilters: QuickFilter[] = [];

  @Output() componentSelected: EventEmitter<number> = new EventEmitter<number>();

  filteredComponentList: { [tl: string]: MechComponent[] } = {};

  techLevels: string[] = [];

  filterForm: FormGroup = this.fb.group({
    search: [null],
    max_slots: [null],
  });

  defaultQuickFilters = [
    { label: 'Recommended', value: 'Recommended' },
    { label: 'Passive', value: 'Passive' },
    { label: 'Reaction', value: 'Reaction' },
  ];

  quickFilters: QuickFilter[] = this.defaultQuickFilters;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.techLevels = Object.keys(this.componentList);

    this.filterForm.get('max_slots')!.valueChanges.subscribe(() => {
      this.filterComponents();
    });

    this.filterForm.get('search')!.valueChanges.subscribe(() => {
      this.filterComponents();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const search = this.filterForm.get('search')?.value || null;
    const maxSlots = this.filterForm.get('max_slots')?.value || null;

    this.filterComponents();

    this.quickFilters = [...this.defaultQuickFilters, ...this.extraQuickFilters]
  }

  setSearch(value: string) {
    const search = this.filterForm.get('search');

    if (search?.value === value) {
      this.clearSearch();
    } else {
      search?.setValue(value);
    }
  }

  clearSearch() {
    this.filterForm.get('search')?.setValue(null);
  }

  clearMaxSlots() {
    this.filterForm.get('max_slots')?.setValue(null);
  }

  matchComponent(component: MechComponent, filter: string): boolean {
    return (
      component.name.toLowerCase().includes(filter) ||
      (component.traits?.some(
        (trait) => trait.toLowerCase().includes(filter)) ?? false) ||
      (component.actions?.some(
        (action) => action.traits?.some(
          (trait) => trait.toLowerCase().includes(filter))) ?? false)
    );
  }

  filterComponents(remove: string | null = null) {
    const search = this.filterForm.get('search')?.value || null;
    const maxSlots = this.filterForm.get('max_slots')?.value || null;

    if (!search && !maxSlots) {
      this.filteredComponentList = this.componentList;

      return;
    }

    const filteredComponentList: { [tl: string]: MechComponent[] } = {};
    const searchLower = (search || "").toLowerCase();

    this.techLevels.forEach((tl) => {
      const techLevelMatches: MechComponent[] = this.componentList[tl].filter(
        (component) => {
          return (
            (
              (maxSlots === null) ||
              (component.slots <= maxSlots)
            ) &&
            (
              !search ||
              this.matchComponent(component, searchLower)
            )
          );
        }
      );

      filteredComponentList[tl] = techLevelMatches;
    });

    this.filteredComponentList = filteredComponentList;
  }

  selectComponent(id: number) {
    this.componentSelected.emit(id);
  }

  removeComponent(id: number) {
    this.componentSelected.emit(-id);
  }

}
