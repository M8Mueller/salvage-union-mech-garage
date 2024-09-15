import { Routes } from '@angular/router';
import { MechViewerComponent } from './components/mech-viewer/mech-viewer.component';

export const routes: Routes = [
    {path: '', component: MechViewerComponent},
    {path: 'mech', component: MechViewerComponent}
];
