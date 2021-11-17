import { HttpEventType } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BlogEntry } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog/blog.service';
import { WINDOW_PROVIDERS } from 'src/app/window-token';

import { CreateBlogEntryComponent } from './create-blog-entry.component';

describe('CreateBlogEntryComponent', () => {
  const fileName = 'myFile.png'
  let component: CreateBlogEntryComponent;
  let fixture: ComponentFixture<CreateBlogEntryComponent>;
  let blogService: BlogService
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
         RouterTestingModule,
         MatDialogModule, 
         AngularMaterialModule, 
         BrowserAnimationsModule],
      declarations: [ CreateBlogEntryComponent ],
      providers: [{
         provide: BlogService, useValue: {
           post: jasmine.createSpy().and.returnValue(of({} as BlogEntry)),
           uploadHeaderImage: jasmine.createSpy().and.returnValue(of({ body: { filename: fileName }, type: HttpEventType.Response}))
          }}, 
        FormBuilder, 
        WINDOW_PROVIDERS]
    })
    .compileComponents();

    blogService = TestBed.inject(BlogService)
    router = TestBed.inject(Router)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBlogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('post', () => {
    it('should post the blog entry and navigate after success', () => {
      spyOn(router, 'navigate').and.stub()
      component.post()
      expect(blogService.post).toHaveBeenCalledWith(component.form.getRawValue())
      expect(router.navigate).toHaveBeenCalledWith(['/home'])
    })
  })

  describe('uploadFile', () => {
    it('should upload the file and update the form with the file name', () => {
      component.file.data = 'data'
      const expectedFormData = new FormData()
      expectedFormData.append('file', 'data')

      component.uploadFile()

      expect(blogService.uploadHeaderImage).toHaveBeenCalledWith(expectedFormData)
      expect(component.form.controls['headerImage'].value).toEqual(fileName)
    })
  })
});
