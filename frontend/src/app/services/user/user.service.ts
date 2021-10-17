import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../authentication/authentication.service';

export interface UserData {
  items: User[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
  links: {
    first: string
    previous: string
    next: string
    last: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  findOne(id: number): Observable<User> {
    return this.httpClient.get<User>('/api/users/' + id)
  }

  findAll(page: number, size: Number, username?: string): Observable<UserData> {
    let params = new HttpParams()
    params = params.append('page', String(page))
    params = params.append('limit', String(size))
    if (username) {
      params = params.append('username', username)
    }
    return this.httpClient.get<UserData>('/api/users', { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }
}
