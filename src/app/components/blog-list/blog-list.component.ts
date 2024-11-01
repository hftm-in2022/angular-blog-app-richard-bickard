import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.services';
import { Blog } from '../../schemas/blog.schema';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  blogEntries: Blog[] = [];
  fallBackImageUrl = 'https://picsum.photos/800/200';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogEntries();
  }

  loadBlogEntries(): void {
       this.blogService.getEntries().subscribe({
      next: (response) => {
        this.blogEntries = response.map((blog) => ({
          ...blog,
          headerImageUrl: blog.headerImageUrl || this.fallBackImageUrl,
        }));
      },
    });
  }
}