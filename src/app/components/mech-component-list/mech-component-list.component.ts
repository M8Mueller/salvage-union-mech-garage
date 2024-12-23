import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MechComponent } from '../../types/mech';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';
import { MechComponentPickerComponent } from '../mech-component-picker/mech-component-picker.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mech-component-list',
  standalone: true,
  imports: [
    CommonModule,
    MechComponentPickerComponent
  ],
  templateUrl: './mech-component-list.component.html',
  styleUrl: './mech-component-list.component.css'
})
export class MechComponentListComponent implements OnInit {
  @Input() key: string = "systems";
  @Input() slots: number = 0;
  @Input() bonusSlots: number = 0;
  @Input() componentList: { [tl: string]: MechComponent[] } = {};
  @Input() components$: Observable<MechComponent[]> = new Observable<MechComponent[]>();

  @Output() componentsChanged = new EventEmitter<MechComponent[]>();

  components: MechComponent[] = [];
  usedSlots: number = 0;

  constructor(
    private data: DataService,
    private storage: StorageService
  ){
  }

  ngOnInit() {
    this.loadComponents();
  }

  loadComponents() {
    const components = this.storage.getData(this.key);

    if (components) {
      for (const id of components) {
        const component = this.data.getComponent(id, this.key);

        if (component) {
          this.components.push(component);
        }
      }

      this.updateComponents();
    }
  }

  storeComponents() {
    const componentIds = this.components.map((c: MechComponent) => c.id);

    this.storage.setData(this.key, componentIds);
  }

  countSlots() {
    this.usedSlots = this.components.reduce(
      (count: number, component: any) => count + component.slots, 0
    );
  }

  updateComponents() {
    this.countSlots();
    this.storeComponents();
    this.componentsChanged.emit(this.components);
  }

  addComponent(id: number) {
    const component = this.data.getComponent(id, this.key);

    if (component) {
      this.components.push(component);

      this.updateComponents();
    }
  }

  removeComponent(index: number) {
    this.components.splice(index, 1);

    this.updateComponents();
  }

  clearComponents() {
    this.components.length = 0;

    this.updateComponents();
  }

}
