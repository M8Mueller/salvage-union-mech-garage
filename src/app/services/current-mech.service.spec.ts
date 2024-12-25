import { TestBed } from '@angular/core/testing';

import { CurrentMechService } from './current-mech.service';

describe('CurrentMechService', () => {
  let service: CurrentMechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentMechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
