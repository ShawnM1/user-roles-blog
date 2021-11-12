import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'
import { User } from 'src/user/models/user.interface'
import { UserService } from 'src/user/user.service'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly userService: UserService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        let canActivate = false
        const roles: string[] = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        )
        if (!roles) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const user = request.user

        this.userService.findOne(user.sub).pipe(
            map((user: User) => roles.includes(user.role))
        ).subscribe((hasRole) => canActivate = hasRole)
        
        return canActivate
    }
}
