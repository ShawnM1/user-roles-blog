import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let authService: AuthenticationService
  let router: Router

  let authSerivceStub: Partial<AuthenticationService> = { 
    login: () => { return of('')}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, 
        MatDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [ LoginComponent ],
      providers: [ 
        { provide: AuthenticationService, useValue: authSerivceStub },
        MatDialog 
      ]
    })
    .compileComponents();
    authService = TestBed.inject(AuthenticationService)
    router = TestBed.inject(Router)
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display the mat dialog', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.loginForm.controls['email'].setValue('admin@mail.com')
    component.loginForm.controls['password'].setValue('password')
    spyOn(authService, 'login').and.returnValue(throwError('err'))

    component.onSubmit()
    fixture.detectChanges()
    
    const matDialogText: HTMLElement = document.getElementsByTagName('p')[0] as HTMLHeadElement;
    expect(matDialogText.innerText).toEqual('Invalid email or password')
  })

  it('should navigate on successful login', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub()
    component.loginForm.controls['email'].setValue('admin@mail.com')
    component.loginForm.controls['password'].setValue('password')

    component.onSubmit()

    expect(router.navigate).toHaveBeenCalledWith(['home']);
  })
});
