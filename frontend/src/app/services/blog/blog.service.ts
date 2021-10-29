import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';

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
}
