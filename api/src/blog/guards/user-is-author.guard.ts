import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { map, Observable, switchMap } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/user.service";
import { BlogEntryEntity } from "../models/blog-entry.entity";
import { BlogEntry } from "../models/blog-entry.interface";
import { BlogService } from "../service/blog.service";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {

    constructor(private userService: UserService, private blogservice: BlogService) {}

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const blogEntryId = request.params.id
        const userId = request.user.sub

        return this.userService.findOne(userId).pipe(
            switchMap((user: User) => this.blogservice.findOne(blogEntryId).pipe(
                map((blogEntry: BlogEntry) => blogEntry.author.id === user.id)
            ))
        )
      }
}