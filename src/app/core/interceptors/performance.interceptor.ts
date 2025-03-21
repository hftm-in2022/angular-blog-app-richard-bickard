import { Injectable, inject } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError, finalize } from "rxjs/operators";
import { PerformanceMetricsService } from "../../performance-monitoring/performance-metrics";

@Injectable()
export class PerformanceInterceptor implements HttpInterceptor {
  private performanceMetricsService = inject(PerformanceMetricsService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Startzeit der Anfrage erfassen
    const startTime = Date.now();
    
    // Endpoint-Name aus URL extrahieren
    const urlParts = req.url.split('/');
    const endpoint = urlParts[urlParts.length - 1].split('?')[0] || 'root';
    
    return next.handle(req).pipe(
      // Bei Erfolg
      tap((event) => {
        if (event instanceof HttpResponse) {
          const success = event.status >= 200 && event.status < 300;
          this.performanceMetricsService.trackApiCall(
            `${req.method}_${endpoint}`,
            startTime,
            success
          );
          
          // Zusätzliche Telemetrie für Datenmenge
          if (event.body) {
            const responseSize = this.estimateObjectSize(event.body);
            this.performanceMetricsService.trackCustomMetric(
              `ResponseSize_${endpoint}`,
              responseSize / 1024, // KB
              'count'
            );
          }
        }
      }),
      
      // Bei Fehler
      catchError((error: HttpErrorResponse) => {
        this.performanceMetricsService.trackApiCall(
          `${req.method}_${endpoint}`,
          startTime,
          false
        );
        return throwError(() => error);
      }),
      
      // In jedem Fall
      finalize(() => {
        const duration = Date.now() - startTime;
        
        // Langsame Anfragen separat erfassen (> 1 Sekunde)
        if (duration > 1000) {
          this.performanceMetricsService.trackCustomMetric(
            `SlowRequest_${req.method}_${endpoint}`,
            duration,
            'timing'
          );
        }
      })
    );
  }
  
  /**
   * Schätzt die Größe eines Objekts in Bytes
   */
  private estimateObjectSize(obj: unknown): number {
    const objectList: unknown[] = [];
    const stack: unknown[] = [obj];
    let bytes = 0;
    
    while (stack.length) {
      const value = stack.pop() as unknown;
      
      if (typeof value === 'boolean') {
        bytes += 4;
      } else if (typeof value === 'string') {
        bytes += value.length * 2;
      } else if (typeof value === 'number') {
        bytes += 8;
      } else if (
        typeof value === 'object' && 
        value !== null &&
        objectList.indexOf(value) === -1
      ) {
        objectList.push(value);
        
        if (Array.isArray(value)) {
          for (const item of value) {
            stack.push(item);
          }
        } else {
          for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
              bytes += key.length * 2;
              stack.push((value as Record<string, unknown>)[key]);
            }
          }
        }
      }
    }
    
    return bytes;
  }
}