import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechScrapCostComponent } from './mech-scrap-cost.component';

describe('MechScrapCostComponent', () => {
  let component: MechScrapCostComponent;
  let fixture: ComponentFixture<MechScrapCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechScrapCostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechScrapCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
