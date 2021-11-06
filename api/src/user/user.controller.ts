import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Pagination } from 'nestjs-typeorm-paginate'
import { map, Observable, of } from 'rxjs'
import { hasRoles } from 'src/auth/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard'
import { RolesGuard } from 'src/auth/guards/roles-guard'
import { User, UserRole } from './models/user.interface'
import { UserService } from './user.service'
import { v4 as uuidv4 } from 'uuid' 
import path = require('path');
import { join } from 'path'
import { UserIsUserGuard } from 'src/auth/guards/user-is-user.guard'

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
            const extension: string = path.parse(file.originalname).ext

            cb(null, `${fileName}${extension}`)
        }
    })
}

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

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(+id)
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
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

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req): Observable<Object> {
        return this.userService.updateOne(req.user.sub, { profileImage: file.filename} as User).pipe(
            map((user: User) => ({ imagePath: user.profileImage }))
        )
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imageName, @Res() res): Observable<Object>{
        return of(res.sendFile(join(process.cwd(),'uploads/profileimages/' + imageName)))
    }
}
