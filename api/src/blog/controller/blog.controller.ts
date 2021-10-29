import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';

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

    // @Get()
    // findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
    //     if (userId == null) {
    //         return this.blogService.findAll()
    //     }
    //     return this.blogService.findByUser(userId)
    // }

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
}
