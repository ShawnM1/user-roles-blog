import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';
import { WINDOW } from 'src/app/window-token';

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss']
})
export class AllBlogEntriesComponent {

  @Input() blogEntries: BlogEntriesPageable | null
  @Output() paginate = new EventEmitter<PageEvent>()

  pageEvent: PageEvent
  origin = this.window.location.origin

  constructor(private router: Router, @Inject(WINDOW) private window: Window) {}

  onPaginateChange(event: PageEvent) {
    console.log(event)
    event.pageIndex = ++event.pageIndex
    this.paginate.emit(event)
  }

  navigate(id: number | undefined) {
    this.router.navigateByUrl("blog-entries/" + id)
  }

}
