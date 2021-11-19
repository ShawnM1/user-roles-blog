import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';;
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from './blog.service';

const repositoryMockFactory = () => ({
  save: jest.fn().mockResolvedValue({}),
  find: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
})

describe('BlogService', () => {
  let service: BlogService;
  let blogRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogService, { provide: getRepositoryToken(BlogEntryEntity), useFactory: repositoryMockFactory }],
    }).compile();

    service = module.get<BlogService>(BlogService);
    blogRepository = module.get(getRepositoryToken(BlogEntryEntity))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', ()=> {
    it('shhould save a blogEntry', () => {
      const userMock = { sub: 1 }
      const blogEntryMock = { title: 'myTitle' } as BlogEntry
      const expecteedBlogEntry = {...blogEntryMock, author: userMock, slug: blogEntryMock.title }
      service.create(userMock, blogEntryMock).subscribe()

      expect(blogRepository.save).toHaveBeenCalledWith(expecteedBlogEntry)
    })
  })

  describe('findAll', () => {
    it('should call the blogRepository find method with author relations', () => {
      service.findAll().subscribe()
      expect(blogRepository.find).toHaveBeenCalledWith({ relations: ['author'] })
    })
  })
  
  describe('findOne', () => {
    it('should call the blogRepostiryo findOne method with author relations', () => {
      const id = 1
      service.findOne(id).subscribe()
      expect(blogRepository.findOne).toHaveBeenLastCalledWith({ id }, { relations: ['author'] })
    })
  })

  describe('deleteOne', () => {
    it('should call the blogRepostory delete method with the id', () => {
      const id = 1
      service.deleteOne(id).subscribe()
      expect(blogRepository.delete).toHaveBeenCalledWith(id)
    })
  })

  describe('updateOne', () => {
    it('should call the blogRepository update method with the id and the blogEntry', () => {
      const id = 1
      const blogEntry = {}
      service.updateOne(id, blogEntry).subscribe()
      expect(blogRepository.update).toHaveBeenCalledWith(id, blogEntry)

    })
  })
});
