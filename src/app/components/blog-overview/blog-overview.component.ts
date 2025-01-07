import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlogEntry, BlogEntrySchema } from '../../types/blogEntry';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BlogApiResponse, BlogApiResponseSchema } from '../../types/blogApiResponse';
import { CommonModule } from '@angular/common';

const ValidationSchema = BlogApiResponseSchema(BlogEntrySchema);

@Component({
  selector: 'blog-overview',
  templateUrl: './blog-overview.component.html',
  styleUrls: ['./blog-overview.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule
  ]
})
export class BlogOverviewComponent implements OnInit {

  blogs: BlogEntry[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.http.get<BlogApiResponse<BlogEntry>>('https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries')
      .subscribe(data => {
        const result = ValidationSchema.safeParse(data);

        if (!result.success) {
          console.error(result.error);

          return;
        }

        this.blogs = result.data.data;
      });
  }
}