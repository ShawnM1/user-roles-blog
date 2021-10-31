import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  BlogEntriesPageable, BlogEntry } from 'src/app/model/blog-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private httpClient: HttpClient) { }

  indexAll(page: number, size: number): Observable<BlogEntriesPageable> {
    let params = new HttpParams()
    params = params.append('page', page)
    params = params.append('limit', size)

    return this.httpClient.get<BlogEntriesPageable>('/api/blog-entries', { params })
  }

  post(blogEntry: BlogEntry): Observable<BlogEntry> {
    return this.httpClient.post<BlogEntry>('/api/blog-entries', blogEntry)
  }

  uploadHeaderImage(formData: FormData): Observable<any> {
    return this.httpClient.post<FormData>('/api/blog-entries/image/upload', formData, { 
      reportProgress: true,
      observe: 'events'
    })
  }
}