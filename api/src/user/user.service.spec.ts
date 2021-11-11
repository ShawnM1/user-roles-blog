import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AuthService } from 'src/auth/auth.service'
import { UserEntity } from './models/user.entity'
import { User, UserRole } from './models/user.interface'
import { UserService } from './user.service'

const repositoryMock = {
    save: jest.fn()
}

describe('UserService', () => {
    let userService: UserService
    let authServiceMock = {
        hashPassword: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: getRepositoryToken(UserEntity), useValue: repositoryMock },
                { provide: AuthService, useValue: authServiceMock },
                UserService
            ]
        }).compile()

        userService = module.get<UserService>(UserService)
    })

    it('should be defined', () => {
        expect(userService).toBeDefined()
    })
    
})
