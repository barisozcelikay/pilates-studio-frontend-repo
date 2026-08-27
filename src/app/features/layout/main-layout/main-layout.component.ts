import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccountDto } from '../../../core/auth/model/account-dto';
import { AuthService } from '../../../core/auth/service/auth-service';
import { MenuDto } from '../../menu-settings/model/menu-dto';
import { MenuService } from '../../menu-settings/service/menu-service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class MainLayoutComponent implements OnInit {
  sidebarOpen = false;
  activeRole = '';
  currentAccount: AccountDto | null = null;
  userMenuOpen = false;
  menuItemModels: MenuDto[] = [];
  expandedMenus = new Set<number>();
  isDarkTheme = false;

  constructor(
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly menuService: MenuService,
  ) {}

  ngOnInit() {
    this.activeRole = this.authService.getActiveRole() ?? '';
    this.authService.getCurrentAccount().subscribe({
      next: (account) => {
        this.currentAccount = account;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('CURRENT ACCOUNT ERROR:', error);
      },
    });
    this.menuService.getMenus().subscribe({
      next: (value) => {
        this.menuItemModels = value;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('MENU ERROR:', error);
      },
    });
    const savedTheme = localStorage.getItem('theme');

    this.isDarkTheme = savedTheme === 'dark';

    document.documentElement.classList.toggle('dark-theme', this.isDarkTheme);
  }

  public getRoleLabel(role: string | null): string {
    switch (role) {
      case 'PROFILE_ADMIN':
        return 'Admin';

      case 'PROFILE_INSTRUCTOR':
        return 'Eğitmen';

      case 'PROFILE_MEMBER':
        return 'Üye';

      default:
        return '';
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
    this.userMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.userMenuOpen = false;
    this.router.navigate(['/login']);
  }

  toggleMenu(menuId: number): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isMenuExpanded(menuId: number): boolean {
    return this.expandedMenus.has(menuId);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;

    document.documentElement.classList.toggle('dark-theme', this.isDarkTheme);

    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
