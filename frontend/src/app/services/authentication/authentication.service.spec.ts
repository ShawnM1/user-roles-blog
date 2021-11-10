import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { User } from 'src/app/model/user.interface';

import { AuthenticationService, JWT_NAME } from './authentication.service';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let httpClientSpy = jasmine.createSpyObj('HttpClient', ['post'])
  let jwtHelperService: JwtHelperService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService], 
    });
    authService = TestBed.inject(AuthenticationService);
    jwtHelperService = TestBed.inject(JwtHelperService)
  });

  afterEach(() => {
    httpClientSpy.post.calls.reset()
  })

  it('should be created', () => {
    expect(authService).toBeTruthy();

  });

  describe('login', () => {
    it('should make a POST request to the api/auth/login endpoint and store the token in local storage', () => {
      const loginForm = { email: 'email', password: 'pw'}
      const tokenObj = { access_token: 'token' }
      httpClientSpy.post.and.returnValue(of(tokenObj))
      spyOn(localStorage, 'setItem').and.stub()

      authService.login(loginForm).subscribe((token: string) => {
        expect(tokenObj).toEqual(tokenObj)
        expect(localStorage.setItem).toHaveBeenCalledWith(JWT_NAME, tokenObj.access_token)
      })
      expect(httpClientSpy.post).toHaveBeenCalledWith('/api/auth/login', loginForm)
    })
  })

  describe('logout', () => {
    it('should remove the JWT from local storage', () => {
      spyOn(localStorage, 'removeItem').and.stub()

      authService.loguout()
      expect(localStorage.removeItem).toHaveBeenCalledWith(JWT_NAME)
    })
  })

  describe('register', () => {
    it('should make a POST request to the /api/users endpoint', () => {
      const user = {} as User
      authService.register(user).subscribe()
      expect(httpClientSpy.post).toHaveBeenCalledWith('/api/users', user)
    })
  })

  describe('getUserId', () => {
   it('should return the userId', () => {
    spyOn(localStorage, 'getItem').and.returnValue('jwt')
    const decodedJwtMock = { sub: 1 }
    spyOn(jwtHelperService, 'decodeToken').and.returnValue(decodedJwtMock)

    authService.getUserId().subscribe((id: number) => {
      expect(id).toEqual(decodedJwtMock.sub)
    })
    expect(localStorage.getItem).toHaveBeenCalledWith(JWT_NAME)
    expect(jwtHelperService.decodeToken).toHaveBeenCalledWith('jwt')
   })
  })

  describe('isAuthenticated', () => {
    it('should return true if the token is not expired', () => {
     spyOn(localStorage, 'getItem').and.returnValue('jwt')
     spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(false)
     const actual = authService.isAuthenticated()

     expect(localStorage.getItem).toHaveBeenCalledWith(JWT_NAME)
     expect(actual).toBeTrue()
    })

    it('should return false if the token is not expired', () => {
      spyOn(localStorage, 'getItem').and.returnValue('jwt')
      spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(true)
      const actual = authService.isAuthenticated()
 
      expect(localStorage.getItem).toHaveBeenCalledWith(JWT_NAME)
      expect(actual).toBeFalse()
     })
  })
});
