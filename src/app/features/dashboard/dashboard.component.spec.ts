import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

import { AccountDto } from '../../core/auth/model/account-dto';
import { AuthService } from '../../core/auth/service/auth-service';
import { CalendarService } from '../calendar/service/calendar-service';
import { MyMembershipService } from '../my-membership/service/my-membership-service';
import { ReservationService } from '../reservations/service/reservation-service';
import { DashboardComponent } from './dashboard.component';

function createDashboard(role: string) {
  const http = {
    get: vi.fn().mockReturnValue(
      of({
        activeMemberCount: 12,
        todayReservationCount: 8,
        monthlyRevenue: 1000,
        todayLessons: [],
        recentActivities: [],
      }),
    ),
  };
  const calendar = {
    findCurrentWeekLessons: vi.fn().mockReturnValue(of([])),
    findLessons: vi.fn().mockReturnValue(of([])),
  };
  const auth = {
    getActiveRole: vi.fn().mockReturnValue(role),
    getCurrentAccount: vi.fn().mockReturnValue(of(new AccountDto())),
  };
  const myMembership = {
    getOverview: vi.fn().mockReturnValue(of({ member: {}, memberships: [], measurements: [], reservations: [] })),
  };
  const reservation = {
    findAllByLessonId: vi.fn().mockReturnValue(of([])),
  };
  const changeDetector = { detectChanges: vi.fn() };
  const component = new DashboardComponent(
    http as unknown as HttpClient,
    changeDetector as unknown as ChangeDetectorRef,
    auth as unknown as AuthService,
    calendar as unknown as CalendarService,
    myMembership as unknown as MyMembershipService,
    reservation as unknown as ReservationService,
  );
  return { component, http, calendar };
}

describe('Dashboard role separation', () => {
  it('loads only the member programme for members', () => {
    const { component, http, calendar } = createDashboard('PROFILE_MEMBER');
    component.ngOnInit();
    expect(calendar.findCurrentWeekLessons).toHaveBeenCalledOnce();
    expect(calendar.findLessons).not.toHaveBeenCalled();
    expect(http.get).not.toHaveBeenCalled();
  });

  it('loads only the studio programme for instructors', () => {
    const { component, http, calendar } = createDashboard('PROFILE_INSTRUCTOR');
    component.ngOnInit();
    expect(calendar.findLessons).toHaveBeenCalledOnce();
    expect(calendar.findCurrentWeekLessons).not.toHaveBeenCalled();
    expect(http.get).not.toHaveBeenCalled();
  });

  it('loads the sensitive summary only for admins', () => {
    const { component, http, calendar } = createDashboard('PROFILE_ADMIN');
    component.ngOnInit();
    expect(http.get).toHaveBeenCalledOnce();
    expect(String(http.get.mock.calls[0][0])).toContain('/dashboard/summary');
    expect(calendar.findLessons).not.toHaveBeenCalled();
    expect(calendar.findCurrentWeekLessons).not.toHaveBeenCalled();
  });
});
