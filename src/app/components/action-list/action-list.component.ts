import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Action } from '../../types/mech';

import { EpTagComponent } from '../ep-tag/ep-tag.component';
import { TraitListComponent } from '../trait-list/trait-list.component';

@Component({
  selector: 'app-action-list',
  standalone: true,
  imports: [
    CommonModule,
    EpTagComponent,
    TraitListComponent
  ],
  templateUrl: './action-list.component.html',
  styleUrl: './action-list.component.css'
})
export class ActionListComponent {
  @Input() actions: Action[] = [];

}
