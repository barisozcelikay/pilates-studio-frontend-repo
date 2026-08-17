import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth.guard';
import { guestGuard } from './core/auth/guard/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },

      {
        path: 'members',
        loadComponent: () =>
          import('./features/members/members.component').then((m) => m.MembersComponent),
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import('./features/instructors/instructors.component').then(
            (m) => m.InstructorsComponent,
          ),
      },
      {
        path: 'lessons',
        loadComponent: () =>
          import('./features/lessons/lessons.component').then((m) => m.LessonsComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
      },
      {
        path: 'studio-service',
        loadComponent: () =>
          import('./features/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
      },
      {
        path: 'settings/menu',
        loadComponent: () =>
          import('./features/menu-settings/menu-settings.component').then(
            (m) => m.MenuSettingsComponent,
          ),
      },
      {
        path: 'settings/accounts',
        loadComponent: () =>
          import('./features/accounts/accounts.component').then((m) => m.AccountsComponent),
      },
      {
        path: 'settings/profiles',
        loadComponent: () =>
          import('./features/profiles/profiles.component').then((m) => m.ProfilesComponent),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
