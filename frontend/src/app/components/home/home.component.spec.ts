import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { BlogService } from 'src/app/services/blog/blog.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let blogService: any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [{ provide: BlogService, useValue: { indexAll: jasmine.createSpy().and.stub()}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    blogService = TestBed.inject(BlogService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPaginateChange', () => {
    it('should call the blogService indexAll method with the pageIndex and pageSize twice', () => {
      const pageEvent = { pageSize: 1, pageIndex: 2} as PageEvent
      component.onPaginateChange(pageEvent)
      expect(blogService.indexAll).toHaveBeenCalledTimes(2)
    })
  })
})

