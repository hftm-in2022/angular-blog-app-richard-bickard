import { Component, inject, OnInit } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BlogService } from "./core/services/blog.service";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AppInsightsService } from "./performance-monitoring/app-insights-integration";
import { PerformanceMetricsService } from "./performance-monitoring/performance-metrics";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [MatProgressSpinnerModule, SidebarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "angular-blog-app-richard-bickard";
  blogService = inject(BlogService);
  private appInsightsService = inject(AppInsightsService);
  private performanceMetricsService = inject(PerformanceMetricsService);

  ngOnInit() {
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
    
    // Track page load time
    const pageLoadTime = this.calculatePageLoadTime();
    this.performanceMetricsService.trackCustomMetric('PageLoadTime', pageLoadTime, 'timing');
    
    // Set a marker for app initialization completed
    performance.mark('app-initialized');
  }

  /**
   * Initialisiert das Performance-Monitoring
   */
  private initPerformanceMonitoring(): void {
    // Initialisiere Application Insights
    this.appInsightsService.init();
    
    // Initialisiere Performance-Metriken
    this.performanceMetricsService.init();
    
    // Erstelle Performance-Marker für App-Start
    performance.mark('app-start');
    
    // Measure app initialization time
    setTimeout(() => {
      performance.measure('app-init-time', 'app-start', 'app-initialized');
      const measures = performance.getEntriesByName('app-init-time');
      if (measures.length > 0) {
        this.performanceMetricsService.trackCustomMetric('AppInitTime', measures[0].duration, 'timing');
      }
    }, 0);
  }

  /**
   * Berechnet die Ladezeit der Seite
   */
  private calculatePageLoadTime(): number {
    // Get navigation timing data
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    return pageLoadTime;
  }
}