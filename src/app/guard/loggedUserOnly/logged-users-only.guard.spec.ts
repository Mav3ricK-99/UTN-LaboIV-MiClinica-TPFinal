import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedUsersOnlyGuard } from './logged-users-only.guard';

describe('loggedUsersOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedUsersOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
