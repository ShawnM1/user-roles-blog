import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from 'src/user/models/user.interface';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

var bcrypt = require('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userService
  let jwtService 

  const userMock = { 
    name: 'tester', 
    username: 'testerUsername', 
    email:'mail@mail.com',
    password: '123',
    role: UserRole.USER
  } as User

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') }}, 
        { provide: UserService, useValue: { findbyEmail: jest.fn() }}
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user without the password when the user exists and their passwords match' ,async () => {
      userService.findbyEmail = jest.fn().mockResolvedValue(userMock)
      jest.spyOn(bcrypt, 'compare').mockReturnValue(true)
      const user: User = await service.validateUser(userMock.email, userMock.password)

      expect(user.password).toBeUndefined()
      expect(userService.findbyEmail).toHaveBeenCalledWith(userMock.email)
    })

    it('should return null when the user exists and their passwords match' ,async () => {
      userService.findbyEmail = jest.fn().mockResolvedValue(userMock)
      jest.spyOn(bcrypt, 'compare').mockReturnValue(false)
      const user: User = await service.validateUser(userMock.email, userMock.password)

      expect(user).toBeNull()
      expect(userService.findbyEmail).toHaveBeenCalledWith(userMock.email)
    })

    it('should return null when the user is not found' ,async () => {
      userService.findbyEmail = jest.fn().mockResolvedValue(undefined)
      jest.spyOn(bcrypt, 'compare').mockReturnValue(true)
      const user: User = await service.validateUser(userMock.email, userMock.password)

      expect(user).toBeNull()
      expect(userService.findbyEmail).toHaveBeenCalledWith(userMock.email)
    })
  })

  describe('login', () => {
    it('should return an access token from the jwtService sign method' , async () => {
      const result = await service.login(userMock)
      expect(result.access_token).toEqual('token')
      expect(jwtService.sign).toHaveBeenCalledWith(userMock)
    })
  })

  describe('hashPassword', () => {
    it('should call bycrpyt hash method' , () => {
      jest.spyOn(bcrypt, 'hash').mockReturnValue('hashed')
      service.hashPassword(userMock.password).subscribe()

      expect(bcrypt.hash).toHaveBeenCalledWith(userMock.password, 12)
    })
  })
});
