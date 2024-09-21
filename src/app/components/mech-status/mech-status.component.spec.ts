import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechStatusComponent } from './mech-status.component';

describe('MechStatusComponent', () => {
  let component: MechStatusComponent;
  let fixture: ComponentFixture<MechStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
