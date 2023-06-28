import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guestsOnlyGuard } from './guests-only.guard';

describe('guestsOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guestsOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
