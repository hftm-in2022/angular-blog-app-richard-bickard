import { ErrorHandler, Injectable } from "@angular/core";
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    window.location.href = "/error";
    console.error(error);
  }
}
