import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogService } from 'src/app/services/blog/blog.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let blogService: BlogService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [BlogService]
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

});
