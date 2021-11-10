import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UserService } from '../services/user/user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  let jwtInterceptor: JwtInterceptor
  let userService: UserService
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        JwtInterceptor,
        UserService
        ]
      })

      jwtInterceptor = TestBed.inject(JwtInterceptor);
      userService = TestBed.inject(UserService)
      httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe('Given a token in localstorage', () => {
    it('should add the bearer token to the request from localstorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('Bearer JWT')
  
      userService.findOne(1).subscribe()
      const httpRequest = httpTestingController.expectOne('/api/users/1')
      expect(httpRequest.request.headers.has('Authorization')).toBeTrue()
    })
  })

  describe('Given there is not a token in localstorage', () => {
    it('should not add the bearer token to the request from localstorage', () => {
      userService.findOne(1).subscribe()
      const httpRequest = httpTestingController.expectOne('/api/users/1')
      expect(httpRequest.request.headers.has('Authorization')).toBeFalse()
    })
  })
});
