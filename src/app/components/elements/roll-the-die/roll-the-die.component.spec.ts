import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollTheDieComponent } from './roll-the-die.component';

describe('RollTheDieComponent', () => {
  let component: RollTheDieComponent;
  let fixture: ComponentFixture<RollTheDieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollTheDieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollTheDieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
