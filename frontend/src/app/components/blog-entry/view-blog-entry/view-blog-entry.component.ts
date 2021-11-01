import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BlogEntry } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog/blog.service';

@Component({
  selector: 'app-view-blog-entry',
  templateUrl: './view-blog-entry.component.html',
  styleUrls: ['./view-blog-entry.component.scss']
})
export class ViewBlogEntryComponent implements OnInit {

  blogEntry$: Observable<BlogEntry> = this.activatedRoute.params.pipe(
    switchMap((params: Params) => {
      const blogEntryId: number = params['id']
      return this.blogService.findOne(blogEntryId)
    })
  )

  constructor(private activatedRoute: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
  }

}
