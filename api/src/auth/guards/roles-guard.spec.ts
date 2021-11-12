import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "src/user/user.service";
import { RolesGuard } from "./roles-guard"
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from "@nestjs/common";
import { User, UserRole } from "src/user/models/user.interface";
import { of } from "rxjs";

describe('RolesGuard', () => {
    let guard: RolesGuard
    let userService
    let reflector
    const mockUser = {
        role: UserRole.ADMIN
    } as User

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: UserService, useValue: { findOne: jest.fn } }, 
                { provide: Reflector, useValue: { get: jest.fn }}, 
                RolesGuard],
          }).compile();

        guard = module.get<RolesGuard>(RolesGuard)  
        userService = module.get<UserService>(UserService)
        reflector = module.get<Reflector>(Reflector)
    })

    it('should be defined', () => {
        expect(guard).toBeDefined()
    })

    it('should return true when the user has a matching role', () => {
        const mockRequest = { user: mockUser}
        userService.findOne = jest.fn().mockReturnValue(of(mockUser))
        reflector.get = jest.fn().mockReturnValue([UserRole.ADMIN])
        const mockExecutionContext = createMock<ExecutionContext>();
        mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest)

        expect(guard.canActivate(mockExecutionContext)).toBeTruthy()
    })

    it('should return false when the user does not have a matching role', async () => {
        const mockRequest = { user: mockUser}
        userService.findOne = jest.fn().mockReturnValue(of(mockUser))
        reflector.get = jest.fn().mockReturnValue([UserRole.USER])
        const mockExecutionContext = createMock<ExecutionContext>();
        mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest)

        const value = guard.canActivate(mockExecutionContext)

        expect(await guard.canActivate(mockExecutionContext)).toBeFalsy()
    })
    it('should return true if the reflector has no roles', async () => {
        const mockRequest = { user: mockUser}
        userService.findOne = jest.fn().mockReturnValue(of(mockUser))
        reflector.get = jest.fn().mockReturnValue(undefined)
        const mockExecutionContext = createMock<ExecutionContext>();
        mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest)

        expect(await guard.canActivate(mockExecutionContext)).toBeTruthy()
    })
})