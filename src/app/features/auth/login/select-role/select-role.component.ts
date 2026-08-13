import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/service/auth-service';


@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss',
})
export class SelectRoleComponent {
  @Input() roles: string[] = [];
  @Input() roleSelectionToken = '';

  loadingRole = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  selectRole(role: string): void {
    if (!this.roleSelectionToken) {
      return;
    }

    this.loadingRole = role;

    this.authService
      .selectRole({
        role,
        roleSelectionToken: this.roleSelectionToken,
      })
      .subscribe({
        next: () => {
          this.loadingRole = '';
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.loadingRole = '';
        },
      });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Yönetici';

      case 'ROLE_INSTRUCTOR':
        return 'Eğitmen';

      case 'ROLE_MEMBER':
        return 'Üye';

      default:
        return role;
    }
  }

  getRoleDescription(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Stüdyo ve sistem yönetimi';

      case 'ROLE_INSTRUCTOR':
        return 'Dersler ve danışan yönetimi';

      case 'ROLE_MEMBER':
        return 'Üyelik ve dersler';

      default:
        return 'Bu profil ile devam et';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'pi pi-shield';

      case 'ROLE_INSTRUCTOR':
        return 'pi pi-user-edit';

      case 'ROLE_MEMBER':
        return 'pi pi-user';

      default:
        return 'pi pi-user';
    }
  }
}
