import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AsyncPipe, CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { BlogCardComponent } from "../../components/blog-card.component";
import { EntryOverview, PagedData } from "../../types";
@Component({
  selector: "app-blog-overview-page",
  templateUrl: "./blog-overview-page.component.html",
  styleUrls: ["./blog-overview-page.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BlogCardComponent, RouterLink, AsyncPipe],
})
export class BlogOverviewPageComponent {
  model = input.required<PagedData<EntryOverview>>();
}
