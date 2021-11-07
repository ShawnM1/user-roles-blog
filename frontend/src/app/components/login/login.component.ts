import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LoginErrorComponent } from '../dialog/login-error/login-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup  = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email,
      Validators.minLength(6)
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(3)
    ])
  })

  constructor(
    private authenticationService: AuthenticationService, 
    private router: Router,
    public dialog: MatDialog) { }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value).pipe(
        map(token => this.router.navigate(['home']))
      ).subscribe({
        error: () => this.openDialog()
      })
    }
  }

  private openDialog() {
    this.dialog.open(LoginErrorComponent)
  }

}
