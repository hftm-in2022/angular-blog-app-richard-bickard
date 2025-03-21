import { Injectable } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

declare const applicationInsights: any;

/**
 * Service zur Integration von Azure Application Insights
 */
@Injectable({
  providedIn: "root",
})
export class AppInsightsService {
  private config = {
    connectionString: "InstrumentationKey=YOUR_INSTRUMENTATION_KEY;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/",
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAutoRouteTracking: true,
  };

  private appInsights: any = null;
  private initialized = false;

  constructor(private router: Router) {}

  /**
   * Initialisiert Azure Application Insights
   */
  public init(): void {
    if (this.initialized) {
      return;
    }

    try {
      // Dynamisches Laden des Application Insights SDK
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://js.monitor.azure.com/scripts/b/ai.2.min.js";
      document.head.appendChild(script);

      script.onload = () => {
        try {
          this.appInsights = applicationInsights.setup(this.config);
          this.appInsights.loadAppInsights();
          this.setupRouteTracking();
          this.initialized = true;
          console.log("Application Insights initialized successfully");
        } catch (e) {
          console.error("Error during Application Insights initialization:", e);
        }
      };
    } catch (e) {
      console.error("Error loading Application Insights script:", e);
    }
  }

  /**
   * Konfiguriert das Tracking von Seitenaufrufen
   */
  private setupRouteTracking(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  /**
   * Verfolgt einen Seitenaufruf
   */
  public trackPageView(name?: string, url?: string): void {
    if (!this.initialized || !this.appInsights) {
      return;
    }

    this.appInsights.trackPageView({
      name,
      uri: url,
    });
  }

  /**
   * Verfolgt einen benutzerdefinierten Event
   */
  public trackEvent(name: string, properties?: { [key: string]: any }): void {
    if (!this.initialized || !this.appInsights) {
      return;
    }

    this.appInsights.trackEvent({ name }, properties);
  }

  /**
   * Verfolgt eine Metrik
   */
  public trackMetric(
    name: string,
    value: number,
    properties?: { [key: string]: any }
  ): void {
    if (!this.initialized || !this.appInsights) {
      console.warn(`Metric tracking failed: ${name} (not initialized)`);
      return;
    }

    try {
      this.appInsights.trackMetric({ name, value }, properties);
    } catch (error) {
      console.warn(`Error tracking metric ${name}:`, error);
    }
  }

  /**
   * Verfolgt eine Exception
   */
  public trackException(exception: Error): void {
    if (!this.initialized || !this.appInsights) {
      return;
    }

    this.appInsights.trackException({ exception });
  }
}