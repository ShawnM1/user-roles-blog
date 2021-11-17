import { UnauthorizedException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { of, throwError } from "rxjs"
import { User } from "src/user/models/user.interface"
import { AuthService } from "../auth.service"
import { LocalStrategy } from "./local.strategy"

describe('LocalStrategy', () => {
    let localStrategy: LocalStrategy
    let authService
    const USERNAME = 'name'
    const PASSWORD = 'pass'

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ 
                LocalStrategy, 
                { provide: AuthService, useValue: { validateUser: jest.fn() } }
            ]
        }).compile()

        localStrategy = module.get<LocalStrategy>(LocalStrategy)
        authService = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(localStrategy).toBeDefined()
    })

    describe('validate', () => {
        it('should return the user when the user is found', async () => {
            authService.validateUser.mockResolvedValue({ id: 1} as User)
            await localStrategy.validate(USERNAME, PASSWORD)
            expect(authService.validateUser).toHaveBeenCalledWith(USERNAME, PASSWORD)
        })

        it('should throw an UnauthorizedException when the user is not found', async() => {
            authService.validateUser.mockResolvedValue(undefined)
            expect(async() => await localStrategy.validate(USERNAME, PASSWORD)).rejects.toEqual(new UnauthorizedException())
        })
    })
})