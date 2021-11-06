import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BlogService } from 'src/app/services/blog/blog.service';
import { WINDOW } from 'src/app/window-token';
import { File } from '../../../model/file.interface'

@Component({
  selector: 'app-create-blog-entry',
  templateUrl: './create-blog-entry.component.html',
  styleUrls: ['./create-blog-entry.component.scss']
})
export class CreateBlogEntryComponent implements OnInit {

  @ViewChild("fileUpload", { static: false}) fileUpload: ElementRef

  file: File = { 
    data: null,
    inProgress: false,
    progress: 0
  }

  origin = this.window.location.origin
  form: FormGroup

  constructor(
    private formBuilder: FormBuilder, 
    private blogService: BlogService, 
    private router: Router,
    @Inject(WINDOW) private window: Window) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{ value:null, disabled: true}],
      title: [null, [Validators.required]],
      slug: [{value: null, disabled: true}],
      description: [null, [Validators.required]],
      body: [null, [Validators.required]],
      headerImage: [null, [Validators.required]]
    })
  }

  post() {
    console.log('posting')
    this.blogService.post(this.form.getRawValue()).subscribe(() => this.router.navigate(['/home']))
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
    console.log(formData)
    this.blogService.uploadHeaderImage(formData).pipe(
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
        console.log(event)
        this.form.patchValue({ headerImage: event.body.filename })
      }
    })
  }

}
