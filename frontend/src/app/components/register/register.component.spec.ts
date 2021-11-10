import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let router: Router
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceStub: Partial<AuthenticationService> = {
    register: () => of('')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [RegisterComponent ],
      providers: [{ provide: AuthenticationService, useValue: authServiceStub }]
    })
    .compileComponents();
    router = TestBed.inject(Router)
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login page on a succesful registration', () => {
    spyOn(router, 'navigate').and.stub()
    component.registerForm.controls['name'].setValue('name')
    component.registerForm.controls['username'].setValue('username')
    component.registerForm.controls['email'].setValue('email@mail.com')
    component.registerForm.controls['password'].setValue('password123')
    component.registerForm.controls['passwordConfirm'].setValue('password123')

    component.onSubmit()
    expect(router.navigate).toHaveBeenCalledWith(['login'])
  })
});
