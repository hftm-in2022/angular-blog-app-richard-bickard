import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogOverviewComponent } from './components/blog-overview/blog-overview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BlogOverviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-blog-app-richard-bickard';
}