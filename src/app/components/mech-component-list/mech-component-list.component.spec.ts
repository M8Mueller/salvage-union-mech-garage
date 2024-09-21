import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechComponentListComponent } from './mech-component-list.component';

describe('MechComponentListComponent', () => {
  let component: MechComponentListComponent;
  let fixture: ComponentFixture<MechComponentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechComponentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechComponentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
