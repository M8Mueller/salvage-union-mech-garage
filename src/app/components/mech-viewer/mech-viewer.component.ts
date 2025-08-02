import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MechCargoComponent } from '../mech-cargo/mech-cargo.component';
import { MechChassisComponent } from "../mech-chassis/mech-chassis.component";
import { MechModulesComponent } from '../mech-modules/mech-modules.component';
import { MechScrapCostComponent } from '../mech-scrap-cost/mech-scrap-cost.component';
import { MechStatusComponent } from '../mech-status/mech-status.component';
import { MechSystemsComponent } from '../mech-systems/mech-systems.component';
import { MechPatternComponent } from '../mech-pattern/mech-pattern.component';

@Component({
  selector: 'app-mech-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MechCargoComponent,
    MechChassisComponent,
    MechModulesComponent,
    MechPatternComponent,
    MechScrapCostComponent,
    MechStatusComponent,
    MechSystemsComponent,
    ReactiveFormsModule,
],
  templateUrl: './mech-viewer.component.html',
  styleUrl: './mech-viewer.component.css'
})
export class MechViewerComponent {
  constructor() {}

}
