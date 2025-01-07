import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { EntryOverview } from "../types";
@Component({
  selector: "app-blog-card",
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: "./blog-card.component.html",
  styleUrl: "./blog-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCardComponent {
  blog = input.required<EntryOverview>();
}
