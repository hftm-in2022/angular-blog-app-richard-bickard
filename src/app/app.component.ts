import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Für NgModel (2-Wege-Datenbindung)
import { CommonModule } from '@angular/common'; // Für ngIf, ngFor, ngSwitch, ngClass, ngStyle
import { MatButtonModule } from '@angular/material/button'; // Angular Material
import { MatToolbarModule } from '@angular/material/toolbar'; // Angular Material
import { MatCardModule } from '@angular/material/card'; // Angular Material

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule, // Hinzufügen des CommonModule für die benötigten Direktiven
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-blog-app-richard-bickard';

  handleClick() {
    window.open(
      'https://github.com/hftm-in2022/angular-blog-app-richard-bickard',
      '_blank',
    );
  }
}
