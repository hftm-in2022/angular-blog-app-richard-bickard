// src/app/components/performance-dashboard/performance-dashboard.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { Subscription, interval } from 'rxjs';

// Interface für Performance-Metrik (falls du die vollständige Datei noch nicht erstellt hast)
interface PerformanceMetric {
  name: string;
  value: number;
  type: 'timing' | 'count' | 'memory';
  timestamp: number;
}

// Mock-Service für Performance-Metriken (falls du die vollständige Datei noch nicht erstellt hast)
class MockPerformanceMetricsService {
  getMetricsHistory(): PerformanceMetric[] {
    return [];
  }
}

@Component({
  selector: 'app-performance-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule
  ],
  providers: [
    // Temporär einen Mock-Service verwenden, falls der echte noch nicht verfügbar ist
    { provide: 'PerformanceMetricsService', useClass: MockPerformanceMetricsService }
  ],
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.scss']
})
export class PerformanceDashboardComponent implements OnInit, OnDestroy {
  // Dummy-Service, falls dein echter Service noch nicht verfügbar ist
  private performanceMetricsService = inject('PerformanceMetricsService' as any);
  private refreshSubscription?: Subscription;
  
  displayedColumns: string[] = ['name', 'value', 'timestamp'];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  updateInterval: number = 5000;
  
  apiResponseTimes: PerformanceMetric[] = [];
  webVitals: PerformanceMetric[] = [];
  resourceMetrics: PerformanceMetric[] = [];
  allMetrics: PerformanceMetric[] = [];
  
  ngOnInit(): void {
    this.refreshData();
    // Auskommentiert, bis der echte Service verfügbar ist
    // this.setupAutoRefresh();
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  refreshData(): void {
    // Mock-Implementierung
    console.log('Refreshing data...');
    // Wenn der echte Service verfügbar ist:
    // const allMetrics = this.performanceMetricsService.getMetricsHistory();
    // this.apiResponseTimes = allMetrics.filter(...);
    // ...
  }
  
  changeUpdateInterval(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    
    this.setupAutoRefresh();
  }
  
  private setupAutoRefresh(): void {
    if (this.updateInterval > 0) {
      this.refreshSubscription = interval(this.updateInterval)
        .subscribe(() => this.refreshData());
    }
  }
  
  // Dummy-Methoden, damit die HTML-Template funktioniert
  formatEndpointName(name: string): string {
    return name;
  }
  
  formatResourceName(name: string): string {
    return name;
  }
  
  formatResourceValue(metric: PerformanceMetric): string {
    return metric.value.toString();
  }
  
  formatWebVitalValue(metric: PerformanceMetric): string {
    return metric.value.toString();
  }
  
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }
  
  getResponseTimeClass(responseTime: number): string {
    return 'response-time-medium';
  }
  
  getWebVitalClass(name: string, value: number): string {
    return '';
  }
  
  calculateAvgResponseTime(): number {
    return 0;
  }
  
  calculateMaxResponseTime(): number {
    return 0;
  }
  
  calculateMinResponseTime(): number {
    return 0;
  }
}