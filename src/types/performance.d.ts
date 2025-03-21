interface Performance {
    memory?: {
      usedJSHeapSize: number;
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
    };
  }
  
  interface PerformanceEntryMap {
    'first-input': PerformanceEventTiming;
  }
  
  interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
  }