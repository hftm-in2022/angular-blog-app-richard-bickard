import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  tap,
  timer
} from "rxjs";
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
import { PerformanceMetricsService } from "../../performance-monitoring/performance-metrics";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

/**
 * Optimierter Blog-Service mit Caching und Performance-Monitoring
 */
@Injectable({
  providedIn: "root",
})
export class OptimizedBlogService {
  private _isLoading = signal(false);
  private httpClient = inject(HttpClient);
  private performanceMetrics = inject(PerformanceMetricsService);
  
  // Cache für Blog-Einträge
  private blogCache = new Map<string, CacheEntry<any>>();
  private cacheLifetimeMs = 5 * 60 * 1000; // 5 Minuten Cache-Lebensdauer
  
  // Observable für getBlogs() Anfragen
  private blogListSubject = new BehaviorSubject<PagedData<EntryOverview> | null>(null);
  private blogListLoading = false;
  
  // Optimierte Konfigurationen
  private readonly defaultPageSize = 10;
  private readonly maxConcurrentRequests = 3;
  private activeRequests = 0;
  private requestQueue: (() => void)[] = [];

  /**
   * Holt eine Liste von Blog-Einträgen mit Pagination und Caching
   */
  getBlogs(
    page = 0,
    pageSize = this.defaultPageSize,
    forceRefresh = false
  ): Observable<PagedData<EntryOverview>> {
    const cacheKey = `blogs_${page}_${pageSize}`;
    
    // Performance-Marker setzen
    const startTime = performance.now();
    
    // Prüfen, ob Daten im Cache sind und noch gültig
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      const cachedData = this.blogCache.get(cacheKey)!.data;
      
      // Tracking für Cache-Hit
      this.performanceMetrics.trackCustomMetric('CacheHit_getBlogs', performance.now() - startTime, 'timing');
      
      return of(cachedData);
    }
    
    // Falls eine Anfrage bereits läuft, den aktuellen Zustand zurückgeben
    if (this.blogListLoading) {
      return this.blogListSubject.asObservable().pipe(
        // Nur gültige Werte durchlassen
        map(data => data || { data: [], pageIndex: 0, pageSize: 0, totalCount: 0 }),
        // Performance-Metrik für wartende Anfrage
        tap(() => this.performanceMetrics.trackCustomMetric('WaitingRequest_getBlogs', performance.now() - startTime, 'timing'))
      );
    }
    
    // Neue Anfrage starten
    this.blogListLoading = true;
    this.setLoading(true);
    
    // Parameter erstellen
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
    
    return this.enqueueRequest<PagedData<EntryOverview>>(() => {
      return this.httpClient
        .get<PagedData<EntryOverview>>(`${BLOG_SERVICE_BASE_URL}/entries`, { params })
        .pipe(
          map((data) => PagedDataSchema(EntryOverviewSchema).parse(data)),
          tap((data) => {
            // Cache aktualisieren
            this.updateCache(cacheKey, data);
            
            // Daten im Subject aktualisieren
            this.blogListSubject.next(data);
            
            // Performance-Tracking
            this.performanceMetrics.trackCustomMetric('ResponseTime_getBlogs', performance.now() - startTime, 'timing');
            this.performanceMetrics.trackCustomMetric('ResultCount_getBlogs', data.data.length, 'count');
          }),
          catchError((error) => {
            console.error('Error fetching blogs:', error);
            // Performance-Tracking für Fehler
            this.performanceMetrics.trackCustomMetric('Error_getBlogs', performance.now() - startTime, 'timing');
            
            // Wenn Cache-Daten vorhanden sind, diese als Fallback verwenden
            const cachedEntry = this.blogCache.get(cacheKey);
            if (cachedEntry) {
              return of(cachedEntry.data);
            }
            
            // Leere Daten zurückgeben
            return of({ data: [], pageIndex: 0, pageSize: 0, totalCount: 0 });
          }),
          finalize(() => {
            this.blogListLoading = false;
            this.setLoading(false);
            this.processQueue();
          }),
          // Ergebnis für mehrere Subscriber teilen
          shareReplay(1)
        );
    });
  }

  /**
   * Holt einen einzelnen Blog-Eintrag mit Caching
   */
  getBlog(id: number | string): Observable<Entry> {
    const cacheKey = `blog_${id}`;
    const startTime = performance.now();
    
    // Prüfen, ob Daten im Cache sind und noch gültig
    if (this.isCacheValid(cacheKey)) {
      const cachedData = this.blogCache.get(cacheKey)!.data;
      this.performanceMetrics.trackCustomMetric('CacheHit_getBlog', performance.now() - startTime, 'timing');
      return of(cachedData);
    }
    
    this.setLoading(true);
    
    return this.enqueueRequest<Entry>(() => {
      return this.httpClient
        .get<Entry>(`${BLOG_SERVICE_BASE_URL}/entries/${id}`)
        .pipe(
          map((data) => EntrySchema.parse(data)),
          tap((data) => {
            this.updateCache(cacheKey, data);
            this.performanceMetrics.trackCustomMetric('ResponseTime_getBlog', performance.now() - startTime, 'timing');
          }),
          catchError((error) => {
            console.error(`Error fetching blog ${id}:`, error);
            this.performanceMetrics.trackCustomMetric('Error_getBlog', performance.now() - startTime, 'timing');
            
            // Wenn Cache-Daten vorhanden sind, diese als Fallback verwenden
            const cachedEntry = this.blogCache.get(cacheKey);
            if (cachedEntry) {
              return of(cachedEntry.data);
            }
            
            throw error;
          }),
          finalize(() => {
            this.setLoading(false);
            this.processQueue();
          }),
          shareReplay(1)
        );
    });
  }

  /**
   * Fügt einen neuen Blog-Eintrag hinzu
   */
  addBlog(entry: NewEntry): Observable<object> {
    const startTime = performance.now();
    this.setLoading(true);
    
    return this.enqueueRequest<object>(() => {
      return this.httpClient
        .post(`${BLOG_SERVICE_BASE_URL}/entries`, entry)
        .pipe(
          tap((response) => {
            // Cache invalidieren, da neue Daten hinzugefügt wurden
            this.invalidateBlogListCache();
            this.performanceMetrics.trackCustomMetric('ResponseTime_addBlog', performance.now() - startTime, 'timing');
          }),
          catchError((error) => {
            console.error('Error adding blog:', error);
            this.performanceMetrics.trackCustomMetric('Error_addBlog', performance.now() - startTime, 'timing');
            throw error;
          }),
          finalize(() => {
            this.setLoading(false);
            this.processQueue();
          })
        );
    });
  }
  
  /**
   * Liket einen Blog-Eintrag
   */
  likeBlog(id: number | string): Observable<object> {
    const startTime = performance.now();
    const cacheKey = `blog_${id}`;
    
    return this.enqueueRequest<object>(() => {
      return this.httpClient
        .post(`${BLOG_SERVICE_BASE_URL}/entries/${id}/like`, { likedByMe: true })
        .pipe(
          tap((response) => {
            // Bloglist- und Detail-Cache invalidieren
            this.invalidateCache(cacheKey);
            this.invalidateBlogListCache();
            
            this.performanceMetrics.trackCustomMetric('ResponseTime_likeBlog', performance.now() - startTime, 'timing');
          }),
          catchError((error) => {
            console.error(`Error liking blog ${id}:`, error);
            this.performanceMetrics.trackCustomMetric('Error_likeBlog', performance.now() - startTime, 'timing');
            throw error;
          }),
          finalize(() => this.processQueue())
        );
    });
  }
  
  /**
   * Löscht einen Blog-Eintrag
   */
  deleteBlog(id: number | string): Observable<object> {
    const startTime = performance.now();
    const cacheKey = `blog_${id}`;
    
    return this.enqueueRequest<object>(() => {
      return this.httpClient
        .delete(`${BLOG_SERVICE_BASE_URL}/entries/${id}`)
        .pipe(
          tap((response) => {
            // Bloglist- und Detail-Cache invalidieren
            this.invalidateCache(cacheKey);
            this.invalidateBlogListCache();
            
            this.performanceMetrics.trackCustomMetric('ResponseTime_deleteBlog', performance.now() - startTime, 'timing');
          }),
          catchError((error) => {
            console.error(`Error deleting blog ${id}:`, error);
            this.performanceMetrics.trackCustomMetric('Error_deleteBlog', performance.now() - startTime, 'timing');
            throw error;
          }),
          finalize(() => this.processQueue())
        );
    });
  }
  
  /**
   * Vorzeitiges Laden von Daten für bessere Benutzererfahrung
   */
  preloadData(): void {
    // Starte Preloading, ohne das Loading-Flag zu setzen
    timer(100).subscribe(() => {
      this.getBlogs(0, this.defaultPageSize, false).subscribe();
    });
  }
  
  /**
   * Cache-Management-Methoden
   */
  private updateCache<T>(key: string, data: T): void {
    this.blogCache.set(key, {
      data,
      expiry: Date.now() + this.cacheLifetimeMs
    });
    
    // Halte die Cache-Größe unter Kontrolle (maximal 50 Einträge)
    if (this.blogCache.size > 50) {
      const oldestKey = Array.from(this.blogCache.keys())[0];
      this.blogCache.delete(oldestKey);
    }
  }
  
  private isCacheValid(key: string): boolean {
    const entry = this.blogCache.get(key);
    if (!entry) return false;
    
    return Date.now() < entry.expiry;
  }
  
  private invalidateCache(key: string): void {
    this.blogCache.delete(key);
  }
  
  private invalidateBlogListCache(): void {
    // Alle Blog-Listen-Einträge im Cache invalidieren
    Array.from(this.blogCache.keys())
      .filter(key => key.startsWith('blogs_'))
      .forEach(key => this.blogCache.delete(key));
    
    // Subject mit null aktualisieren, um anzuzeigen, dass Daten veraltet sind
    this.blogListSubject.next(null);
  }
  
  /**
   * Request Queue für Begrenzung gleichzeitiger Anfragen
   */
  private enqueueRequest<T>(requestFn: () => Observable<T>): Observable<T> {
    return new Observable<T>(observer => {
      const runRequest = () => {
        if (this.activeRequests >= this.maxConcurrentRequests) {
          // Anfrage in die Warteschlange stellen
          this.requestQueue.push(runRequest);
          return;
        }
        
        this.activeRequests++;
        
        const subscription = requestFn().subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error(err),
          complete: () => {
            this.activeRequests--;
            observer.complete();
          }
        });
        
        return () => {
          subscription.unsubscribe();
          this.activeRequests--;
        };
      };
      
      return runRequest();
    });
  }
  
  private processQueue(): void {
    if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }
  }
  
  /**
   * Loading-Status-Management
   */
  get isLoading() {
    return this._isLoading;
  }

  setLoading(isLoading: boolean) {
    this._isLoading.set(isLoading);
  }
}