import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { finalize, map, Observable } from "rxjs";
import { BLOG_SERVICE_BASE_URL } from "../constants";
import {
  Entry,
  EntryOverview,
  EntryOverviewSchema,
  EntrySchema,
  NewEntry,
  PagedData,
  PagedDataSchema,
} from "../../types";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  private _isLoading = signal(false);
  httpClient = inject(HttpClient);

  getBlogs(): Observable<PagedData<EntryOverview>> {
    this.setLoading(true);

    return this.httpClient
      .get<PagedData<EntryOverview>>(`${BLOG_SERVICE_BASE_URL}/entries`)
      .pipe(map((data) => PagedDataSchema(EntryOverviewSchema).parse(data)))
      .pipe(finalize(() => this.setLoading(false)));
  }

  getBlog(id: number | string): Observable<Entry> {
    this.setLoading(true);

    return this.httpClient
      .get<Entry>(`${BLOG_SERVICE_BASE_URL}/entries/${id}`)
      .pipe(map((data) => EntrySchema.parse(data)))
      .pipe(finalize(() => this.setLoading(false)));
  }

  addBlog(entry: NewEntry): Observable<object> {
    console.log("add");
    this.setLoading(true);
    return this.httpClient
      .post(`${BLOG_SERVICE_BASE_URL}/entries`, entry)
      .pipe(finalize(() => this.setLoading(false)));
  }
  get isLoading() {
    return this._isLoading;
  }

  setLoading(isLoading: boolean) {
    this._isLoading.set(isLoading);
  }
}
