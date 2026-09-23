import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../../core/auth/service/auth-service';
import { SeoService } from '../../../shared/service/seo-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  loading = false;
  submitted = false;

  forgotPasswordForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly seoService: SeoService,
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.seoService.set({
      title: 'Şifremi Unuttum',
      description: 'Olive Pilates Studio üyelik hesabınız için şifre yenileme bağlantısı talep edin.',
      path: '/forgot-password',
      noindex: true,
    });
  }

  submit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.forgotPasswordForm.controls.email.value!;

    this.authService
      .forgotPassword(email)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.submitted = true;

          this.messageService.add({
            severity: 'success',
            summary: 'E-posta gönderildi',
            detail: 'Şifre yenileme bağlantısı e-posta adresinize gönderildi.',
            life: 5000,
          });
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Şifre yenileme işlemi sırasında bir hata oluştu.',
            life: 4000,
          });
        },
      });
  }
}
