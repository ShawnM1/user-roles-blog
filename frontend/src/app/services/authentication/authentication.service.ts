import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'

export interface User {
  name: string
  username: string
  email: string
  password: string
  passwordConfirm: string
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  login(loginForm: { email: string, password: string}) {
    return this.httpClient.post<any>('/api/auth/login', { email: loginForm.email, password: loginForm.password }).pipe(
      map(token => {
        localStorage.setItem('blog-token', token.access_token)
        return token
      })
    )
  }

  register(registerForm: User){
    return this.httpClient.post<any>('/api/users', registerForm)
  }
}
