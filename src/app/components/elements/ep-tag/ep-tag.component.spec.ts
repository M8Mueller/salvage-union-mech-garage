import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpTagComponent } from './ep-tag.component';

describe('EpTagComponent', () => {
  let component: EpTagComponent;
  let fixture: ComponentFixture<EpTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
