import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WINDOW_PROVIDERS } from 'src/app/window-token';

import { AllBlogEntriesComponent } from './all-blog-entries.component';

describe('AllBlogEntriesComponent', () => {
  let router: Router
  let component: AllBlogEntriesComponent;
  let fixture: ComponentFixture<AllBlogEntriesComponent>;

  beforeEach(async () => {
    let windowMock: Window = <any>{ };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ AllBlogEntriesComponent ],
      providers: [WINDOW_PROVIDERS]
    })
    .compileComponents();

    router = TestBed.inject(Router)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBlogEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate by id', () => {
    spyOn(router, 'navigateByUrl').and.stub()
    component.navigate(1)
    expect(router.navigateByUrl).toHaveBeenCalledWith('blog-entries/1')
  })
});
