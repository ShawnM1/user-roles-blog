import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { User } from 'src/user/models/user.interface';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';
import { BlogController } from './blog.controller';

describe('BlogController', () => {
  let controller: BlogController;
  let blogService: BlogService

  const blogEntryMock = { title: 'blog title' } as BlogEntry
  const userMock = { id: 1} as User
  const mockGuard: CanActivate = { canActivate: jest.fn().mockReturnValue(true) }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [{ provide: BlogService, useValue: { 
        create: jest.fn().mockReturnValue(of(blogEntryMock)),
        findAll: jest.fn(),
        paginateAll: jest.fn(),
        paginateByUser: jest.fn(),
        findByUser: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn()
      }}]
    })
    .overrideGuard(UserIsAuthorGuard).useValue(mockGuard)
    .overrideGuard(JwtAuthGuard).useValue(mockGuard)
    .compile();
    
    controller = module.get<BlogController>(BlogController);
    blogService = module.get<BlogService>(BlogService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return the blog entry saved', () => {
      controller.create(blogEntryMock, { user: userMock }).subscribe((blogEntry: BlogEntry) => {
        expect(blogEntry).toEqual(blogEntryMock)
      })
      expect(blogService.create).toHaveBeenCalledWith(userMock, blogEntryMock)
    })
  })
});
