import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Observable } from 'rxjs'
import { hasRoles } from 'src/auth/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard'
import { RolesGuard } from 'src/auth/guards/roles-guard'
import { User, UserRole } from './models/user.interface'
import { UserService } from './user.service'

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() user: User): Observable<User> {
        return this.userService.create(user)
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<User> {
        return this.userService.findOne(+id)
    }

    @Get()
    index(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 10,
        @Query('username') username: string): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit

        if (!username) {
            return this.userService.paginate({ page, limit, route: 'http://localhost:3000/api/users' })
        }    
        return this.userService.paginateFilterByUser({ page, limit, route: 'http://localhost:3000/api/users' }, { username })
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(+id)
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(+id, user)
    }

    @Put(':id/role')
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateRoleOfUser(+id, user)
    }
}
