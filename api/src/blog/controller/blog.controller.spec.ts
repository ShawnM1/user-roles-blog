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
        paginateAll: jest.fn().mockReturnValue(of('')),
        paginateByUser: jest.fn().mockReturnValue(of('')),
        findOne: jest.fn().mockReturnValue(of('')),
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

  describe('index', () => {
    it('should call paginateAll from blogService', () => {
      const page = 1
      const limit = 10
      controller.index(page, limit).subscribe()
      expect(blogService.paginateAll).toHaveBeenCalledWith({ page, limit })
    })

    it('should default the limit to 100 when the limit argument is over 100', () => {
      const page = 1
      const overLimit = 101
      controller.index(page, overLimit).subscribe()
      expect(blogService.paginateAll).toHaveBeenCalledWith({ page, limit: 100 })
    })
  })

  describe('indexByUser', () => {
    it('should call paginateAll from blogService', () => {
      const userId = 7
      const page = 1
      const limit = 10
      controller.indexByUser(page, limit, userId).subscribe()
      expect(blogService.paginateByUser).toHaveBeenCalledWith({ page, limit }, userId)
    })

    it('should default the limit to 100 when the limit argument is over 100', () => {
      const userId = 7
      const page = 1
      const overLimit = 101
      controller.indexByUser(page, overLimit, userId).subscribe()
      expect(blogService.paginateByUser).toHaveBeenCalledWith({ page, limit: 100 }, userId)
    })
  })

  describe('findOne', () => {
    it('should call the blogService findOne method', () => {
      const id = 1;
      controller.findOne(1).subscribe()
      expect(blogService.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('updateOne', () => {
    it('should call the blogService updateOne method', () => {
      const blogEntryToUpdate = {} as BlogEntry
      const id = 1
      controller.updateOne(id, blogEntryToUpdate)
      expect(blogService.updateOne).toHaveBeenCalledWith(id, blogEntryToUpdate)
    })
  })

  describe('deleteOne', () => {
    it('should call the blogService deleteOne method', () => {
      const id = 1
      controller.deleteOne(id)
      expect(blogService.deleteOne).toHaveBeenCalledWith(id)
    })
  })
});
