import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';

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
  loadError = '';
  readonly today = new Date();

  constructor(
    private readonly http: HttpClient,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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

  activityTypeLabel(type: DashboardActivity['type']): string {
    return type === 'MEMBERSHIP' ? 'Üyelik' : type === 'PAYMENT' ? 'Ödeme' : 'Rezervasyon';
  }
}
