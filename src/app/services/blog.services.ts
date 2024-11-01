import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { z } from 'zod';
import { Blog, blogSchema } from '../schemas/blog.schema';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  public getEntries(): Observable<Blog[]> {
    return this.http.get<{ data: Blog[] }>(this.apiUrl + '/entries').pipe(
      map((response) => {
        const parsed = z.array(blogSchema).safeParse(response.data);
        if (parsed.success) {
          return parsed.data;
        } else {
          console.error('Data validation failed:', parsed.error);
          throw new Error('Data validation failed');
        }
      }),
    );
  }
}