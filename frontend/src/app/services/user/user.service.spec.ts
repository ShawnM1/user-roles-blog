import { HttpClient, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User } from 'src/app/model/user.interface';

import { UserData, UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post', 'delete']);

  const userMock: User = {
    id: 1,
    name: 'name',
    username: 'username',
    email: 'mail.com',
    role: 'ADMIN',

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy}]
    });
    userService = TestBed.inject(UserService);

    httpClientSpy.get.calls.reset()
    httpClientSpy.put.calls.reset()
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  describe('findOne', () => {
    it('should make GET request to the api', () => {
      httpClientSpy.get.and.returnValue(of(userMock))
      const userId = 1

      userService.findOne(userId).subscribe((user: User) => {
        expect(user).toEqual(userMock)
      })
      expect(httpClientSpy.get).toHaveBeenCalledWith(`/api/users/${userId}`)
    })
  })

  describe('updateOne', () => {
    it('should make a PUT request to the api', () => {
      httpClientSpy.put.and.returnValue(of(userMock))

      userService.updateOne(userMock).subscribe((user: User) => {
        expect(user).toEqual(userMock)
      })
      expect(httpClientSpy.put).toHaveBeenCalledWith(`api/users/${userMock.id}`, userMock)
    })
  })

  describe('findAll', () => {
    it('should return UserData', () => {
      const userDataMock  = {
        items: [userMock]
      } as UserData

      let params = new HttpParams().append('page', String(1)).append('limit', String(2))
      httpClientSpy.get.and.returnValue(of(userDataMock))

      userService.findAll(1, 2).subscribe((userData: UserData) => {
        expect(userData).toEqual(userDataMock)
      })

      expect(httpClientSpy.get).toHaveBeenCalledWith('/api/users', { params })
    })
  })

  describe('updateProfileImage', () => {
    it('should make a POST request to the api', () => {
      const formData: FormData = {} as FormData
      const options =  { reportProgress: true, observe: 'events'}

      userService.uploadProfileImage(formData)

      expect(httpClientSpy.post).toHaveBeenCalledWith('/api/users/upload', formData, options)
    })
  })
});
