import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { NewEntry, NewEntrySchema } from "../../types";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { z } from "zod";
import { BlogService } from "../../core/services/blog.service";
@Component({
  selector: "app-add-blog-page",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: "./add-blog-page.component.html",
  styleUrl: "./add-blog-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBlogPageComponent {
  newEntryForm: FormGroup;
  private blogService = inject(BlogService);
  private router = inject(Router);
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.newEntryForm = this.fb.group({
      title: [""],
      content: [""],
      headerImageUrl: [""],
    });
  }
  onSubmit(): void {
    const formValue = this.newEntryForm.value;
    try {
      const validatedData: NewEntry = NewEntrySchema.parse(formValue);
      this.blogService.addBlog(validatedData).subscribe({
        next: () => this.router.navigate(["/"]),
        error: (error) => this.snackBar.open(`An error occured: ${error}`),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.map((error) =>
          this.snackBar.open(
            `Validation Error: ${error.path} - ${error.message}`,
            "Close",
            { duration: 3000 },
          ),
        );
      }
    }
  }
}
