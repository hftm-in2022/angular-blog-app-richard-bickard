import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BlogService } from "./core/services/blog.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "angular-blog-app-richard-bickard";
  blogService = inject(BlogService);
}
