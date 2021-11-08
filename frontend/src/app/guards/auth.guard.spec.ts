import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../services/authentication/authentication.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  let authService: AuthenticationService 
  let authServiceStub = {
    isAuthenticated: jasmine.createSpy()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule],
      providers: [{ provide: AuthenticationService, useValue: authServiceStub}]
    }).compileComponents()

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router)
    authService = TestBed.inject(AuthenticationService)
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to the login when not authenticated', () => {
    authServiceStub.isAuthenticated.and.returnValue(false)
    spyOn(router, 'navigate').and.stub()

    const canActive = guard.canActivate()

    expect(router.navigate).toHaveBeenCalledWith(['login'])
    expect(canActive).toBeFalse()
  }) 
  
  it('should return true when the user is authenticated', () => {
    authServiceStub.isAuthenticated.and.returnValue(true)
    spyOn(router, 'navigate').and.stub()

    const canActive = guard.canActivate()

    expect(router.navigate).not.toHaveBeenCalled()
    expect(canActive).toBeTrue()
  })
});