import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';

@Controller('blogs')
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
    findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
        if (userId == null) {
            return this.blogService.findAll()
        }
        return this.blogService.findByUser(userId)
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<BlogEntry> {
        return this.blogService.findOne(id)
    }
}
