import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechComponentBrowserComponent } from './mech-component-browser.component';

describe('MechComponentBrowserComponent', () => {
  let component: MechComponentBrowserComponent;
  let fixture: ComponentFixture<MechComponentBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechComponentBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechComponentBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
