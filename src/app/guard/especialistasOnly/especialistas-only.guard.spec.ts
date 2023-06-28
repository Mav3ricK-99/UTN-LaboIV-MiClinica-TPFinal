import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { especialistasOnlyGuard } from './especialistas-only.guard';


describe('loggedUsersOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => especialistasOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
