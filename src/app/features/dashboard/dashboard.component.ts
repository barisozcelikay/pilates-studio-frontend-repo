import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AccountDto } from '../../core/auth/model/account-dto';
import { AuthService } from '../../core/auth/service/auth-service';
import { LessonDto } from '../lessons/model/lesson-dto';
import { CalendarService } from '../calendar/service/calendar-service';
import { MyMembershipService } from '../my-membership/service/my-membership-service';
import { ReservationService } from '../reservations/service/reservation-service';

interface DashboardSummary {
  activeMemberCount: number;
  todayReservationCount: number;
  monthlyRevenue: number;
  todayLessons: DashboardLesson[];
  recentActivities: DashboardActivity[];
}

interface DashboardLesson {
  name: string;
  startAt: string;
  endAt: string;
  instructorName: string;
  reservationCount: number;
  capacity: number;
}

interface DashboardActivity {
  type: 'MEMBERSHIP' | 'PAYMENT' | 'RESERVATION';
  icon: string;
  description: string;
  occurredAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  currentAccount: AccountDto | null = null;
  memberLessons: LessonDto[] = [];
  instructorLessons: LessonDto[] = [];
  remainingSessionCount: number | null = null;
  remainingCancellationRightCount: number | null = null;
  lessonParticipants = new Map<number, string[]>();
  loadError = '';
  readonly today = new Date();

  constructor(
    private readonly http: HttpClient,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly calendarService: CalendarService,
    private readonly myMembershipService: MyMembershipService,
    private readonly reservationService: ReservationService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentAccount().subscribe({
      next: (account) => {
        this.currentAccount = account;
        this.changeDetector.detectChanges();
      },
    });

    if (this.isMember) {
      this.calendarService.findCurrentWeekLessons().subscribe({
        next: (lessons) => {
          this.memberLessons = lessons
            .filter((lesson) => lesson.status === 'ACTIVE')
            .sort(
              (a, b) => new Date(a.startAt ?? 0).getTime() - new Date(b.startAt ?? 0).getTime(),
            );
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          this.loadError = error?.error?.message ?? 'Haftalık ders programı yüklenemedi.';
          this.changeDetector.detectChanges();
        },
      });

      this.myMembershipService.getOverview().subscribe({
        next: (overview) => {
          const activeMembership = overview.memberships
            .filter((membership) => membership.status === 'ACTIVE')
            .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];
          this.remainingSessionCount = activeMembership?.remainingSessionCount ?? null;
          this.remainingCancellationRightCount =
            activeMembership?.remainingCancellationRightCount ?? null;
          this.changeDetector.detectChanges();
        },
      });
      return;
    }

    if (this.isInstructor) {
      this.calendarService.findLessons().subscribe({
        next: (lessons) => {
          const now = new Date();
          const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);

          this.instructorLessons = lessons
            .filter((lesson) => {
              const start = new Date(lesson.startAt ?? 0);
              return lesson.status === 'ACTIVE' && start >= weekStart && start < weekEnd;
            })
            .sort(
              (a, b) => new Date(a.startAt ?? 0).getTime() - new Date(b.startAt ?? 0).getTime(),
            );
          this.changeDetector.detectChanges();
          this.loadInstructorParticipants();
        },
        error: (error) => {
          this.loadError = error?.error?.message ?? 'Haftalık program yüklenemedi.';
          this.changeDetector.detectChanges();
        },
      });
      return;
    }

    if (this.isAdmin) {
      this.http.get<DashboardSummary>(`${environment.apiUrl}/dashboard/summary`).subscribe({
        next: (summary) => {
          this.summary = summary;
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          this.loadError = error?.error?.message ?? 'Stüdyo özeti yüklenemedi.';
          this.changeDetector.detectChanges();
        },
      });
    }
  }

  get isMember(): boolean {
    return this.authService.getActiveRole() === 'PROFILE_MEMBER';
  }

  get isInstructor(): boolean {
    return this.authService.getActiveRole() === 'PROFILE_INSTRUCTOR';
  }

  get isAdmin(): boolean {
    return this.authService.getActiveRole() === 'PROFILE_ADMIN';
  }

  get upcomingInstructorLessons(): LessonDto[] {
    const now = Date.now();
    return this.instructorLessons
      .filter((lesson) => new Date(lesson.startAt ?? 0).getTime() >= now)
      .slice(0, 5);
  }

  get todayInstructorLessonCount(): number {
    return this.instructorLessons.filter((lesson) => {
      const start = new Date(lesson.startAt ?? 0);
      return start.toDateString() === this.today.toDateString();
    }).length;
  }

  participantsFor(lesson: LessonDto): string[] {
    return lesson.id ? (this.lessonParticipants.get(lesson.id) ?? []) : [];
  }

  private loadInstructorParticipants(): void {
    const lessons = this.upcomingInstructorLessons.filter((lesson) => lesson.id != null);
    if (!lessons.length) {
      return;
    }

    forkJoin(
      lessons.map((lesson) =>
        this.reservationService.findAllByLessonId(lesson.id!).pipe(catchError(() => of([]))),
      ),
    ).subscribe((results) => {
      results.forEach((reservations, index) => {
        const lessonId = lessons[index].id!;
        const names = reservations
          .filter((reservation) => reservation.status === 'CONFIRMED' || reservation.status === 'ATTENDED')
          .map((reservation) => reservation.memberName);
        this.lessonParticipants.set(lessonId, names);
      });
      this.changeDetector.detectChanges();
    });
  }

  get todayMemberLessons(): LessonDto[] {
    return this.memberLessons.filter(
      (lesson) => new Date(lesson.startAt ?? 0).toDateString() === this.today.toDateString(),
    );
  }

  get upcomingMemberLessons(): LessonDto[] {
    const now = Date.now();
    const todayEnd = new Date(this.today);
    todayEnd.setHours(23, 59, 59, 999);
    return this.memberLessons
      .filter((lesson) => new Date(lesson.startAt ?? 0).getTime() >= now)
      .filter((lesson) => new Date(lesson.startAt ?? 0).getTime() > todayEnd.getTime())
      .slice(0, 4);
  }

  get nextMemberLesson(): LessonDto | null {
    const now = Date.now();
    const upcoming = this.memberLessons
      .filter((lesson) => new Date(lesson.startAt ?? 0).getTime() >= now)
      .sort((a, b) => new Date(a.startAt ?? 0).getTime() - new Date(b.startAt ?? 0).getTime());
    return upcoming[0] ?? null;
  }

  get openLessonCount(): number {
    return this.memberLessons.filter((lesson) => (lesson.capacity ?? 0) > lesson.reservationCount)
      .length;
  }

  lessonOccupancy(lesson: LessonDto): number {
    if (!lesson.capacity) return 0;
    return Math.min(Math.round((lesson.reservationCount / lesson.capacity) * 100), 100);
  }

  activityTypeLabel(type: DashboardActivity['type']): string {
    return type === 'MEMBERSHIP' ? 'Üyelik' : type === 'PAYMENT' ? 'Ödeme' : 'Rezervasyon';
  }
}
