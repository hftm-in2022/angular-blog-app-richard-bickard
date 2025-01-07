import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo',
  standalone: true,
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
  ],
})
export class DemoComponent {
  userName: string = '';
  userStatus: string = 'offline';
  isActive: boolean = false;
  items: string[] = ['Item 1', 'Item 2', 'Item 3'];

  toggleButton() {
    this.isActive = !this.isActive;
  }
}