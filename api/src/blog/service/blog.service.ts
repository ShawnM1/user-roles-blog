import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { BlogEntry } from '../models/blog-entry.interface';

const slugify = require('slugify')

@Injectable()
export class BlogService {

    constructor(@InjectRepository(BlogEntryEntity)private readonly blogRepository: Repository<BlogEntryEntity>, private userService: UserService) {}

    create(user: User, blogEntry: BlogEntry): Observable<BlogEntry> {
        user.id = user.sub
        delete user.sub

        blogEntry.author = user
        return this.generateSlug(blogEntry.title).pipe(
            switchMap((slug: string) => {
                blogEntry.slug = slug
                return from(this.blogRepository.save(blogEntry))
            })
        )
    }

    findAll(): Observable<BlogEntry[]>{
        return from(this.blogRepository.find({ relations: ['author'] }))
    }

    findByUser(userId: number): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({
            where: {
                author: userId
            },
            relations: ['author']
        }))
    }

    findOne(id: number): Observable<BlogEntry> {
        return from(this.blogRepository.findOne({ id }, { relations: ['author'] }))
    }

    updateOne(id: number, blogEntry: BlogEntry): Observable<BlogEntry> {
        return from(this.blogRepository.update(id, blogEntry)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id): Observable<any> {
        return from(this.blogRepository.delete(id))
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title))
    }



}
