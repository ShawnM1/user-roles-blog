import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { User } from 'src/user/models/user.interface';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';
import { BlogController } from './blog.controller';

describe('BlogController', () => {
  let blogController: BlogController;
  const blogServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    paginateAll: jest.fn(),
    paginateByUser: jest.fn(),
    findByUser: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn()
  }

  const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [{ provide: BlogService, useValue: blogServiceMock }]
    })
    .overrideGuard(UserIsAuthorGuard).useValue(mockGuard)
    .overrideGuard(JwtAuthGuard).useValue(mockGuard)
    .compile();

    blogController = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(blogController).toBeDefined();
  });
  describe('create', () => {
    it('should call the blogService create method', () => {
      const user = {} as User
      const req = { user }
      const blogToCreate = {} as BlogEntry

      blogController.create(blogToCreate, req)

      expect(blogServiceMock.create).toHaveBeenLastCalledWith(blogToCreate, user)
    })
  })
});
