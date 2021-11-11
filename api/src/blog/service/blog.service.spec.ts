import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/user.service';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let blogService: BlogService;

  let blogRepositoryMock = {
    find: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockRejectedValue({})
  }

  let userServiceMock  = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: UserService, useValue: userServiceMock },
        { provide: getRepositoryToken(BlogEntryEntity), useValue: blogRepositoryMock }
      ],
    }).compile();

    blogService = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(blogService).toBeDefined();
  });

  describe('findAll', () => {
    it('should call the blog repository with author relations', () => {
      const expectedArg = { relations: ['author'] }
      blogService.findAll().subscribe()
      expect(blogRepositoryMock.find).toHaveBeenCalledWith(expectedArg)
    })
  })
});
