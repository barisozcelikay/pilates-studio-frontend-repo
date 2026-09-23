import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth.guard';
import { guestGuard } from './core/auth/guard/guest.guard';
import { roleGuard } from './core/auth/guard/role.guard';

const ADMIN = 'PROFILE_ADMIN';
const INSTRUCTOR = 'PROFILE_INSTRUCTOR';
const MEMBER = 'PROFILE_MEMBER';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/studio-home/studio-home.component').then((m) => m.StudioHomeComponent),
  },

  {
    path: 'home',
    pathMatch: 'full',
    redirectTo: '',
  },

  {
    path: 'studio',
    pathMatch: 'full',
    redirectTo: '',
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
    path: 'gizlilik-politikasi',
    loadComponent: () =>
      import('./features/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent,
      ),
  },

  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent,
      ),
  },

  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    loadComponent: () =>
      import('./features/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        data: { roles: [ADMIN, INSTRUCTOR, MEMBER] },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },

      {
        path: 'members/:id/memberships',
        data: { roles: [ADMIN, INSTRUCTOR] },
        loadComponent: () =>
          import('./features/member-memberships/member-memberships.component').then(
            (m) => m.MemberMembershipsComponent,
          ),
      },
      {
        path: 'my-membership',
        data: { roles: [MEMBER] },
        loadComponent: () =>
          import('./features/my-membership/my-membership.component').then(
            (m) => m.MyMembershipComponent,
          ),
      },
      {
        path: 'members',
        data: { roles: [ADMIN, INSTRUCTOR] },
        loadComponent: () =>
          import('./features/members/members.component').then((m) => m.MembersComponent),
      },
      {
        path: 'instructors',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/instructors/instructors.component').then(
            (m) => m.InstructorsComponent,
          ),
      },
      {
        path: 'lessons/:id',
        data: { roles: [ADMIN, INSTRUCTOR] },
        loadComponent: () =>
          import('./features/lesson-detail/lesson-detail.component').then(
            (m) => m.LessonDetailComponent,
          ),
      },
      {
        path: 'lessons',
        data: { roles: [ADMIN, INSTRUCTOR] },
        loadComponent: () =>
          import('./features/lessons/lessons.component').then((m) => m.LessonsComponent),
      },
      {
        path: 'services',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/studio-services/studio-services.component').then(
            (m) => m.StudioServicesComponent,
          ),
      },
      {
        path: 'calendar',
        data: { roles: [ADMIN, INSTRUCTOR, MEMBER] },
        loadComponent: () =>
          import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
      },
      {
        path: 'studio-services',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/studio-services/studio-services.component').then(
            (m) => m.StudioServicesComponent,
          ),
      },
      {
        path: 'studio-packages',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/studio-packages/studio-packages.component').then(
            (m) => m.StudioPackagesComponent,
          ),
      },
      {
        path: 'payments',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/payments/payments.component').then((m) => m.PaymentsComponent),
      },
      {
        path: 'settings/menu',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/menu-settings/menu-settings.component').then(
            (m) => m.MenuSettingsComponent,
          ),
      },
      {
        path: 'settings/accounts',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/accounts/accounts.component').then((m) => m.AccountsComponent),
      },
      {
        path: 'settings/profiles',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/profiles/profiles.component').then((m) => m.ProfilesComponent),
      },
      {
        path: 'settings/reservation-policies',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/reservation-policies/reservation-policies.component').then(
            (m) => m.ReservationPoliciesComponent,
          ),
      },
      {
        path: 'meetings/contact-requests',
        data: { roles: [ADMIN] },
        loadComponent: () =>
          import('./features/contact-requests/contact-requests.component').then(
            (m) => m.ContactRequestsComponent,
          ),
      },
      {
        path: 'meetings/appointments',
        data: { roles: [ADMIN, INSTRUCTOR] },
        loadComponent: () =>
          import('./features/appointments/appointments.component').then(
            (m) => m.AppointmentsComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
