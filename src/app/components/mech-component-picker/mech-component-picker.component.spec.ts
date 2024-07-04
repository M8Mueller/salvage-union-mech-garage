import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechComponentPickerComponent } from './mech-component-picker.component';

describe('MechComponentPickerComponent', () => {
  let component: MechComponentPickerComponent;
  let fixture: ComponentFixture<MechComponentPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechComponentPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechComponentPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
