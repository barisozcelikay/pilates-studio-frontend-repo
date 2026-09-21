import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../../core/auth/service/auth-service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, PasswordModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  @Output() done = new EventEmitter<void>();

  loading = false;
  errorMessage = '';
  successMessage = '';

  form = this.formBuilder.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Yeni şifreler eşleşmiyor.';
      return;
    }

    this.loading = true;

    this.authService
      .changePassword(currentPassword!, newPassword!)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Şifreniz başarıyla güncellendi.';
          this.form.reset();
          setTimeout(() => this.done.emit(), 1200);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'Şifre değiştirilemedi. Lütfen tekrar deneyin.';
        },
      });
  }
}
