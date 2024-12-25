import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechPatternComponent } from './mech-pattern.component';

describe('MechPatternComponent', () => {
  let component: MechPatternComponent;
  let fixture: ComponentFixture<MechPatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechPatternComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
