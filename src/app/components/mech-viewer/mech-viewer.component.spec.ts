import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechViewerComponent } from './mech-viewer.component';

describe('MechViewerComponent', () => {
  let component: MechViewerComponent;
  let fixture: ComponentFixture<MechViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
