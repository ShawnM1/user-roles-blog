import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post<any>('/api/auth/login', { email, password }).pipe(
      map(token => {
        localStorage.setItem('blog-token', token.access_token)
        return token
      })
    )
  }
}
