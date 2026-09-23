import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/auth/service/auth-service';
import { LoginRequest } from '../../../core/auth/model/login-request';
import { Router, RouterLink } from '@angular/router';
import { SelectRoleComponent } from './select-role/select-role.component';
import { SeoService } from '../../../shared/service/seo-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    SelectRoleComponent,
    RouterLink,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loading = false;

  errorMessage = '';

  loginForm;

  // Role selection
  showRoleSelection = false;
  roles: string[] = [];
  roleSelectionToken = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly seoService: SeoService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.seoService.set({
      title: 'Üye Girişi',
      description: 'Olive Pilates Studio üye, eğitmen ve yönetici paneline giriş yapın.',
      path: '/login',
      noindex: true,
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: LoginRequest = {
      email: this.loginForm.controls.email.value!,
      password: this.loginForm.controls.password.value!,
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.roleSelectionRequired) {
          this.roles = response.roles ?? [];
          this.roleSelectionToken = response.roleSelectionToken ?? '';

          this.showRoleSelection = true;
          this.cdr.detectChanges();

          return;
        }

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        this.loading = false;

        this.errorMessage = error?.error?.message ?? 'E-posta veya şifre hatalı.';
      },
    });
  }
}
