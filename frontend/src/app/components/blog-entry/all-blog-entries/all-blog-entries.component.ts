import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss']
})
export class AllBlogEntriesComponent {

  @Input() blogEntries: BlogEntriesPageable | null
  @Output() paginate = new EventEmitter<PageEvent>()

  pageEvent: PageEvent

  constructor(private router: Router) {}

  onPaginateChange(event: PageEvent) {
    console.log(event)
    event.pageIndex = ++event.pageIndex
    this.paginate.emit(event)
  }

  navigate(id: number | undefined) {
    this.router.navigateByUrl("blog-entries/" + id)
  }

}
