import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { of } from 'rxjs'
import { AuthService } from 'src/auth/auth.service'
import { UserEntity } from './models/user.entity'
import { User, UserRole } from './models/user.interface'
import { UserService } from './user.service'

const hasedPassword = 'hashed'

describe('UserService', () => {
    let service: UserService
    let userRepository
    let authService 

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService, 
                { provide: AuthService, useValue: { hashPassword: jest.fn().mockReturnValue(of('hasedPassword')) }},
                { provide: getRepositoryToken(UserEntity), useFactory: () => ({
                    save: jest.fn().mockResolvedValue({}),
                    find: jest.fn().mockResolvedValue({}),
                    findOne: jest.fn().mockResolvedValue({}),
                    update: jest.fn().mockResolvedValue({}),
                    delete: jest.fn().mockResolvedValue({})
            })}],
        }).compile()

        service = module.get<UserService>(UserService)
        userRepository = module.get(getRepositoryToken(UserEntity))
        authService = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    describe('create', () => {
        it('hash the passwor and save the user', () => {
            const userMock = { 
                name: 'tester', 
                username: 'testerUsername', 
                email:'mail@mail.com',
                password: '123',
                role: UserRole.USER
            } as User

            service.create(userMock).subscribe((user: User) => {
                expect(user.password).toBeUndefined()
            })
            expect(authService.hashPassword).toHaveBeenCalledWith(userMock.password)
            expect(userRepository.save).toHaveBeenCalledWith({...userMock, password: hasedPassword})
        })
    })
})
