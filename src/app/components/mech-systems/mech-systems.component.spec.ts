import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechSystemsComponent } from './mech-systems.component';

describe('MechSystemsComponent', () => {
  let component: MechSystemsComponent;
  let fixture: ComponentFixture<MechSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechSystemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
