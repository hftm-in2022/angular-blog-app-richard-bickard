// blog.component.ts
import { Component, Input } from '@angular/core';
import { Blog } from '../../schemas/blog.schema';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  @Input() blogEntry!: Blog;
}