import { Injectable, inject } from "@angular/core";
import { AppInsightsService } from "./app-insights-integration";

export interface PerformanceMetric {
    name: string;
    value: number;
    type: "timing" | "count" | "memory";
    timestamp: number;
}

/**
 * Service zur Erfassung und Berichterstattung von Performance-Metriken
 */
@Injectable({
    providedIn: "root",
})
export class PerformanceMetricsService {
    private appInsightsService = inject(AppInsightsService);
    private metricsHistory: PerformanceMetric[] = [];
    private readonly MAX_HISTORY_SIZE = 100;

    /**
     * Initialisiert den PerformanceMetricsService
     */
    public init(): void {
        // Performance-Beobachter für die Wegleistungskennzahlen
        this.setupPerformanceObserver();

        // Speichernutzung alle 30 Sekunden messen
        setInterval(() => this.trackMemoryUsage(), 30000);
    }

    /**
     * Richtet die Performance-Beobachter für relevante Web-Vitals ein
     */
    private setupPerformanceObserver(): void {
        if (!window.PerformanceObserver) {
            console.warn("PerformanceObserver API nicht verfügbar.");
            return;
        }

        try {
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const fidEntry = entry as unknown as { startTime: number; processingStart: number };
                    const metric: PerformanceMetric = {
                        name: "FID",
                        value: fidEntry.processingStart - fidEntry.startTime,
                        type: "timing",
                        timestamp: Date.now()
                    };
                    this.trackMetric(metric);
                }
            });
            fidObserver.observe({ type: "first-input", buffered: true });

            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                const metric: PerformanceMetric = {
                    name: "LCP",
                    value: lastEntry ? lastEntry.startTime : 0,
                    type: "timing",
                    timestamp: Date.now()
                };
                this.trackMetric(metric);
            });
            lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

            // Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    // @ts-ignore: Temporal type handling
                    if (!entry.hadRecentInput) {
                        // @ts-ignore: Temporal type handling
                        clsValue += entry.value;
                    }
                }
                const metric: PerformanceMetric = {
                    name: "CLS",
                    value: clsValue,
                    type: "count",
                    timestamp: Date.now()
                };
                this.trackMetric(metric);
            });
            clsObserver.observe({ type: "layout-shift", buffered: true });

            // Navigation-Timing für Seitenladezeiten
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const navEntry = entry as PerformanceNavigationTiming;

                    // Verschiedene Phasen der Ladezeit messen
                    this.trackMetric({
                        name: "TTFB",
                        value: navEntry.responseStart - navEntry.startTime,
                        type: "timing",
                        timestamp: Date.now()
                    });

                    this.trackMetric({
                        name: "DOMContentLoaded",
                        value: navEntry.domContentLoadedEventEnd - navEntry.startTime,
                        type: "timing",
                        timestamp: Date.now()
                    });

                    this.trackMetric({
                        name: "PageLoadComplete",
                        value: navEntry.loadEventEnd - navEntry.startTime,
                        type: "timing",
                        timestamp: Date.now()
                    });
                }
            }).observe({ type: "navigation", buffered: true });

            // Ressourcen-Laden-Zeiten messen
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const resource = entry as PerformanceResourceTiming;

                    // Nur für wichtige Ressourcen (z.B. JS, CSS)
                    if (["script", "link", "fetch", "xmlhttprequest"].includes(resource.initiatorType)) {
                        this.trackMetric({
                            name: `ResourceLoad_${resource.initiatorType}`,
                            value: resource.responseEnd - resource.startTime,
                            type: "timing",
                            timestamp: Date.now()
                        });
                    }
                }
            }).observe({ type: "resource", buffered: true });

            console.log("Performance-Beobachter wurden erfolgreich eingerichtet.");
        } catch (e) {
            console.error("Fehler beim Einrichten der Performance-Beobachter:", e);
        }
    }

    /**
     * Verfolgt die Speichernutzung, wenn verfügbar
     */
    private trackMemoryUsage(): void {
        // Typesafe memory info check
        const memoryInfo = (performance as any).memory;

        if (memoryInfo) {
            this.trackMetric({
                name: "UsedJSHeapSize",
                value: memoryInfo.usedJSHeapSize / (1024 * 1024), // In MB
                type: "memory",
                timestamp: Date.now()
            });

            this.trackMetric({
                name: "JSHeapSizeLimit",
                value: memoryInfo.jsHeapSizeLimit / (1024 * 1024), // In MB
                type: "memory",
                timestamp: Date.now()
            });
        }
    }

    /**
     * Verfolgt einen API-Aufruf
     */
    public trackApiCall(endpoint: string, startTime: number, success: boolean): void {
        const duration = Date.now() - startTime;

        this.trackMetric({
            name: `API_${endpoint}_${success ? "Success" : "Failure"}`,
            value: duration,
            type: "timing",
            timestamp: Date.now()
        });
    }

    /**
     * Verfolgt eine benutzerdefinierte Metrik
     */
    public trackCustomMetric(name: string, value: number, type: "timing" | "count" | "memory" = "count"): void {
        this.trackMetric({
            name,
            value,
            type,
            timestamp: Date.now()
        });
    }

    /**
     * Speichert eine Metrik und sendet sie an Application Insights
     */
    private trackMetric(metric: PerformanceMetric): void {
        // Zur lokalen History hinzufügen
        this.metricsHistory.push(metric);

        // History begrenzen
        if (this.metricsHistory.length > this.MAX_HISTORY_SIZE) {
            this.metricsHistory.shift();
        }

        // An Application Insights senden
        try {
            this.appInsightsService.trackMetric(
                metric.name,
                metric.value,
                {
                    type: metric.type,
                    timestamp: new Date(metric.timestamp).toISOString()
                }
            );
        } catch (error) {
            console.warn("Fehler beim Senden der Metrik an Application Insights:", error);
        }

        console.debug(`Performance-Metrik erfasst: ${metric.name} = ${metric.value} (${metric.type})`);
    }

    /**
     * Gibt die Metrik-Historie zurück
     */
    public getMetricsHistory(): PerformanceMetric[] {
        return [...this.metricsHistory];
    }

    /**
     * Gibt die Metriken nach Namen gefiltert zurück
     */
    public getMetricsByName(name: string): PerformanceMetric[] {
        return this.metricsHistory.filter(m => m.name === name);
    }
}