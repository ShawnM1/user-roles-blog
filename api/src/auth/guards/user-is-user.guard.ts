import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class UserIsUserGuard implements CanActivate {

    constructor(@Inject(forwardRef(() => UserService ))private readonly userService: UserService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // From user request
        const params = request.params
        // From JWT
        const userId = request.user.sub

        // See if the user exists in DB because they could have been deleted
        // after the JWT was received.
        return this.userService.findOne(userId).pipe(
            map((user: User) => {
                let hasPermission = false

                if (userId === +params.id) {
                    hasPermission = true
                }
                return user && hasPermission
            })
        )
    }

}