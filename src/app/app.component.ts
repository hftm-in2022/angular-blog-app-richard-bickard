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

  // Variablen für verschiedene Angular-Konzepte
  isVisible = true; // Für ngIf
  status = 'online'; // Für ngSwitch
  items = ['Banane', 'Äpfel', 'Kaffee']; // Für ngFor
  isBold = false; // Definiert, ob der Text fett ist
  isItalic = false; // Definiert, ob der Text kursiv ist
  isUnderlined = false; // Definiert, ob der Text unterstrichen ist
  color = 'red'; // Für NgStyle
  name = ''; // Für 2-Wege-Datenbindung

  // Methoden für die Events
  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.status = this.isVisible ? 'online' : 'offline'; // Status basierend auf der Sichtbarkeit
  }

  changeColor() {
    const randomColor = this.getRandomColor();
    this.color = randomColor;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  handleClick() {
    window.open(
      'https://github.com/hftm-in2022/angular-blog-app-richard-bickard',
      '_blank',
    );
  }

  toggleBold() {
    this.isBold = !this.isBold;
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
  }

  toggleUnderline() {
    this.isUnderlined = !this.isUnderlined;
  }
}
