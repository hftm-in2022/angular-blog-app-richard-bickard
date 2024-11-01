import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogComponent } from './components/blog/blog.component';
import { loggingInterceptor } from './interceptors/logging.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    BlogListComponent 
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  providers: [
   provideHttpClient(withInterceptors([loggingInterceptor])),
  ],
  bootstrap: [AppComponent] // AppComponent als Bootstrap-Komponente
})
export class AppModule {}