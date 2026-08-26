import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AccountDto } from '../../core/auth/model/account-dto';
import { AuthService } from '../../core/auth/service/auth-service';
import { LessonDto } from '../lessons/model/lesson-dto';
import { CalendarService } from '../calendar/service/calendar-service';

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
  imports: [DatePipe, DecimalPipe, NgFor, NgIf, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  currentAccount: AccountDto | null = null;
  memberLessons: LessonDto[] = [];
  loadError = '';
  readonly today = new Date();

  constructor(
    private readonly http: HttpClient,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly calendarService: CalendarService,
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
            .sort((a, b) => new Date(a.startAt ?? 0).getTime() - new Date(b.startAt ?? 0).getTime());
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          this.loadError = error?.error?.message ?? 'Haftalık ders programı yüklenemedi.';
          this.changeDetector.detectChanges();
        },
      });
      return;
    }

    this.http.get<DashboardSummary>(`${environment.apiUrl}/dashboard/summary`).subscribe({
      next: (summary) => {
        this.summary = summary;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.loadError = error?.error?.message ?? 'Dashboard özeti yüklenemedi.';
        this.changeDetector.detectChanges();
      },
    });
  }

  get isMember(): boolean {
    return this.authService.getActiveRole() === 'PROFILE_MEMBER';
  }

  get upcomingMemberLessons(): LessonDto[] {
    const now = Date.now();
    return this.memberLessons.filter((lesson) => new Date(lesson.startAt ?? 0).getTime() >= now).slice(0, 4);
  }

  get nextMemberLesson(): LessonDto | null {
    return this.upcomingMemberLessons[0] ?? null;
  }

  get openLessonCount(): number {
    return this.memberLessons.filter((lesson) => (lesson.capacity ?? 0) > lesson.reservationCount).length;
  }

  lessonOccupancy(lesson: LessonDto): number {
    if (!lesson.capacity) return 0;
    return Math.min(Math.round((lesson.reservationCount / lesson.capacity) * 100), 100);
  }

  activityTypeLabel(type: DashboardActivity['type']): string {
    return type === 'MEMBERSHIP' ? 'Üyelik' : type === 'PAYMENT' ? 'Ödeme' : 'Rezervasyon';
  }
}
