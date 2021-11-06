import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { WINDOW } from 'src/app/window-token';
import { File } from '../../../model/file.interface'

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent implements OnInit {
  
  @ViewChild("fileUpload", { static: false}) fileUpload: ElementRef

  file: File = { 
    data: null,
    inProgress: false,
    progress: 0
  }

  form: FormGroup 
  origin = this.window.location.origin

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthenticationService, 
    private userSevice: UserService,
    @Inject(WINDOW) private window: Window) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{ value: null, disabled: true }, Validators.required],
      name: [null, Validators.required],
      username: [null, Validators.required],
      profileImage: [null]
    })

    this.authService.getUserId().pipe(
      switchMap((id: number) => this.userSevice.findOne(id).pipe(
        tap((user: User) => {
          this.form.patchValue({
            id: user.id,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage
          })
        })
      ))
    ).subscribe()
  }

  onClick() {
    const fileInput = this.fileUpload.nativeElement
    fileInput.click()
    fileInput.onchange = () => {
      this.file = { 
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      }
      this.fileUpload.nativeElement.value = ''
      this.uploadFile()
    }
  }

  uploadFile() {
    console.log('uploading')
    const formData = new FormData()
    formData.append('file', this.file.data)
    this.file.inProgress = true

    this.userSevice.uploadProfileImage(formData).pipe(
      map((event) => {
        switch(event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total)
            break
          case HttpEventType.Response:
            return event  
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false
        return of('Upload failed')
      })
    ).subscribe((event: any) => {
      if (typeof(event) === 'object') {
        this.form.patchValue({ profileImage: event.body.imagePath })
      }
    })
  }

  update() {
    this.userSevice.updateOne(this.form.getRawValue()).subscribe()
  }

}
