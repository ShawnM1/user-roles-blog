import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';
import { v4 as uuidv4 } from 'uuid' 
import { Image } from '../models/image.interface';
import { join } from 'path';

export const storage = {
    storage: diskStorage({
        destination: './uploads/blog-entry-images',
        filename: (req, file, cb) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
            const extension: string = path.parse(file.originalname).ext

            cb(null, `${fileName}${extension}`)
        }
    })
}

@Controller('blog-entries')
@UseInterceptors(ClassSerializerInterceptor)
export class BlogController {

    constructor(private blogService: BlogService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() blogEntry: BlogEntry, @Req() req): Observable<BlogEntry> {
        const user = req.user
        return this.blogService.create(user, blogEntry)
    }

    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
        ) {
            limit = limit > 100 ? 100 : limit
            return this.blogService.paginateAll({ limit, page})

    }

    @Get('user/:user')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('user') userId: number
        ) {
            limit = limit > 100 ? 100 : limit
            return this.blogService.paginateByUser({ limit, page}, userId)

    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<BlogEntry> {
        return this.blogService.findOne(id)
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() blogEntry: BlogEntry): Observable<BlogEntry> {
        return this.blogService.updateOne(id, blogEntry)
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.blogService.deleteOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req): Observable<Image> {
      return of(file)
    }

    @Get('image/:imagename')
    findProfileImage(@Param('imagename') imageName, @Res() res): Observable<Object>{
        return of(res.sendFile(join(process.cwd(),'uploads/blog-entry-images/' + imageName)))
    }
}