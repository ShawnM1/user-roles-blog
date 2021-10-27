import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'

export interface User {
  id: number
  name: string
  username: string
  email: string
  password: string
  passwordConfirm: string
  role: string
  profileImage: string
}

export const JWT_NAME = 'blog-token'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService) { }

  login(loginForm: { email: string, password: string}) {
    return this.httpClient.post<any>('/api/auth/login', { email: loginForm.email, password: loginForm.password }).pipe(
      map(token => {
        localStorage.setItem(JWT_NAME, token.access_token)
        return token
      })
    )
  }

  register(registerForm: User){
    return this.httpClient.post<any>('/api/users', registerForm)
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME) || undefined
    return !this.jwtHelper.isTokenExpired(token)
  }

  getUserId(): Observable<number>{
    const jwt = localStorage.getItem(JWT_NAME) || undefined
    const userId = this.jwtHelper.decodeToken(jwt).sub

    return of(userId)
  }
}
