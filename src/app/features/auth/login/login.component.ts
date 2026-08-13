import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/auth/service/auth-service';
import { LoginRequest } from '../../../core/auth/model/login-request';
import { Router } from '@angular/router';
import { SelectRoleComponent } from './select-role/select-role.component';



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
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
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
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required],
    });
  }

  /*login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    const request: LoginRequest = {
      email: this.loginForm.controls.email.value!,
      password: this.loginForm.controls.password.value!,
    };

    this.authService
      .login(request)
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
            detail: 'Giriş başarılı olmuştur.',
            life: 3000,
          });
        },

        error: (error) => {
          if (error?.status === 401) {
            this.errorMessage = 'E-posta veya şifre hatalı.';
          } else if (error?.status === 403) {
            this.errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
          } else if (error?.status === 0) {
            this.errorMessage = 'Sunucuya bağlanılamadı.';
          } else {
            this.errorMessage = 'Giriş sırasında bir hata oluştu.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Giriş başarısız',
            detail: this.errorMessage,
            life: 4000,
          });
        },
      });
  }*/

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
          this.cdr.detectChanges()

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
