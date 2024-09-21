import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechCargoComponent } from './mech-cargo.component';

describe('MechCargoComponent', () => {
  let component: MechCargoComponent;
  let fixture: ComponentFixture<MechCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechCargoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
