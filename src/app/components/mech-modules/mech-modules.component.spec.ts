import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechModulesComponent } from './mech-modules.component';

describe('MechModulesComponent', () => {
  let component: MechModulesComponent;
  let fixture: ComponentFixture<MechModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechModulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
