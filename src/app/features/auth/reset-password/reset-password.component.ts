import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../../core/auth/service/auth-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, PasswordModule, ToastModule],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  loading = false;

  token = '';
  type = '';

  resetPasswordForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessageService,
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    this.type = this.route.snapshot.queryParamMap.get('type') ?? '';
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Geçersiz bağlantı',
        detail: 'Şifre yenileme bağlantısı geçersiz.',
        life: 4000,
      });

      return;
    }

    if (this.type !== 'initial' && this.type !== 'reset') {
      this.messageService.add({
        severity: 'error',
        summary: 'Geçersiz bağlantı',
        detail: 'Şifre yenileme bağlantısı geçersiz.',
        life: 4000,
      });

      return;
    }

    const { newPassword, confirmPassword } = this.resetPasswordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Şifreler eşleşmiyor',
        detail: 'Girdiğiniz şifreler aynı olmalıdır.',
        life: 4000,
      });

      return;
    }

    this.loading = true;

    const request = {
      token: this.token,
      newPassword: newPassword!,
    };

    const request$ =
      this.type === 'initial'
        ? this.authService.setPassword(request)
        : this.authService.resetPassword(request);

    request$
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail:
              this.type === 'initial'
                ? 'Şifreniz oluşturuldu. Artık giriş yapabilirsiniz.'
                : 'Şifreniz başarıyla yenilendi.',
            life: 3000,
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'İşlem başarısız',
            detail: 'Bağlantı geçersiz veya süresi dolmuş olabilir.',
            life: 4000,
          });
        },
      });
  }
}
