import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Entry } from "../../types";
@Component({
  selector: "app-blog-detail-page",
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCardHeader,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: "./blog-detail-page.component.html",
  styleUrl: "./blog-detail-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailPageComponent {
  id = input.required<number>();
  blog = input.required<Entry>();
  public toggleLike() {
    console.log("like toggled"); // unbenutzer Code nur log
  }
}
