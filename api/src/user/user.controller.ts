import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UserEntity } from './models/user.entity'
import { User } from './models/user.interface'
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
    findAll(): Observable<User[]> {
        return this.userService.findAll()
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(+id)
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(+id, user)
    }
}
