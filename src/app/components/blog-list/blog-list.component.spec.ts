import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.services';
import { BlogListComponent } from './blog-list.component';
import { loggingInterceptor } from '../../interceptors/logging.interceptor';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogListComponent],
      imports: [
        MatCardModule,
        CommonModule,
      ],
      providers: [BlogService, provideHttpClient(withInterceptors([loggingInterceptor]))] // BlogService bereitstellen, wenn nötig
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});