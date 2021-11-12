import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "src/user/user.service"
import { UserIsUserGuard } from "./user-is-user.guard"
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from "@nestjs/common";
import { of } from "rxjs";

describe('UserIsUserGuard', () => {
    let userIsUserGuard: UserIsUserGuard
    let userService

    const userMock = { 
        id: 1
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserIsUserGuard, 
                { provide: UserService, useValue: { findOne: jest.fn() } }
            ]
        }).compile()

        userIsUserGuard = module.get<UserIsUserGuard>(UserIsUserGuard)
        userService = module.get<UserService>(UserService)
    })

    it('should compile', () => {
        expect(userIsUserGuard).toBeDefined()
    })

    it('should return true if the user exists and their id matches the id from the request user property', async () => {
        const mockRequest = { user: { sub: 1}, params: { id: 1}}
        const context = createMock<ExecutionContext>()
        context.switchToHttp().getRequest.mockReturnValue(mockRequest)
        userService.findOne = jest.fn().mockReturnValue(of(userMock))

        expect(await userIsUserGuard.canActivate(context)).toBeTruthy()
    })

    it('should return false if the request param id does not match the user id', async () => {
        const mockRequest = { user: { sub: 1}, params: { id: 2}}
        const context = createMock<ExecutionContext>()
        context.switchToHttp().getRequest.mockReturnValue(mockRequest)
        userService.findOne = jest.fn().mockReturnValue(of(userMock))

        expect(await userIsUserGuard.canActivate(context)).toBeFalsy()
    })

    it('should return false if the user does not exist', async() => {
        const mockRequest = { user: { sub: 1}, params: { id: 1}}
        const context = createMock<ExecutionContext>()
        context.switchToHttp().getRequest.mockReturnValue(mockRequest)
        userService.findOne = jest.fn().mockReturnValue(of(undefined))

        expect(await userIsUserGuard.canActivate(context)).toBeFalsy()
    })
})