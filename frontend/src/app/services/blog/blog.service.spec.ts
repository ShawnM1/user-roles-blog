import { HttpClient, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ExpandOperator } from 'rxjs/internal/operators/expand';
import { BlogEntry } from 'src/app/model/blog-entry.interface';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  let httpClient = jasmine.createSpyObj('HttpCleint',['get', 'post', 'put', 'delete']) as HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{ provide: HttpClient, useValue: httpClient }, BlogService]
    });
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findOne', () => {
    it('should make a GET request with the blog-entry id', () => {
      const id = 1
      service.findOne(id)
      expect(httpClient.get).toHaveBeenCalledWith('/api/blog-entries/1')
    })
  })

  describe('indexAll', () => {
    it('should be called with the page and limit params', () => {
      const page = 1
      const limit = 5
      const expectedHttpParams = new HttpParams().append('page', page).append('limit', limit)
      service.indexAll(page, limit)
      expect(httpClient.get).toHaveBeenCalledWith('/api/blog-entries', { params: expectedHttpParams})
    })
  })

  describe('post', () => {
    it('should make a POST reequest with the blog', () => {
      const blogentryToSave = {} as BlogEntry
      service.post(blogentryToSave)
      expect(httpClient.post).toHaveBeenCalledWith('/api/blog-entries', blogentryToSave)
    })
  })

  describe('indexByUser', () => {
    it('should make a post request with the user id', () => {
      const page = 1
      const limit = 5
      const userId = 55
      const expectedHttpParams = new HttpParams().append('page', page).append('limit', limit)
      service.indexByUser(userId, page, limit)
      expect(httpClient.get).toHaveBeenCalledWith('api/blog-entries/user/' + userId, { params: expectedHttpParams})
    })
  })

});
