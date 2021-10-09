import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'

export interface RegisterForm {
  name: string
  username: string
  email: string
  password: string
  passwordConfirm: string
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

  register(registerForm: RegisterForm){
    return this.httpClient.post<any>('/api/users', registerForm)
  }
}
