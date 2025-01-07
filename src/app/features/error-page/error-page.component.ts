import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
@Component({
  selector: "app-error-page",
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: "./error-page.component.html",
  styleUrl: "./error-page.component.scss",
})
export class ErrorPageComponent {}
