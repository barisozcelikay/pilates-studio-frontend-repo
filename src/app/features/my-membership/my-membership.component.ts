import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { MemberSelfOverviewDto, MyMembershipService } from './service/my-membership-service';
import { ToastService } from '../../shared/service/toast-service';

@Component({
  selector: 'app-my-membership',
  standalone: true,
  imports: [DatePipe, Tabs, TabList, Tab, TabPanels, TabPanel],
  templateUrl: './my-membership.component.html',
  styleUrl: '../member-memberships/member-memberships.component.scss',
})
export class MyMembershipComponent implements OnInit {
  overview: MemberSelfOverviewDto | null = null;
  loading = true;

  constructor(
    private readonly service: MyMembershipService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.service.getOverview().subscribe({
      next: (overview) => {
        this.overview = overview;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error(error?.error?.message ?? 'Üyelik bilgileriniz yüklenemedi.');
        this.cdr.detectChanges();
      },
    });
  }

  accountStatusLabel(): string {
    const status = this.overview?.member.status;
    if (status === 'ACTIVE') return 'Aktif';
    if (status === 'PASSIVE') return 'Pasif';
    return 'E-Mail Onayı Bekliyor';
  }

  reservationStatusLabel(status: string): string {
    return (
      {
        CONFIRMED: 'Rezerve edildi',
        ATTENDED: 'Katıldı',
        CANCELLED_WITH_RIGHT: 'İptal edildi',
        REMOVED: 'Dersten çıkarıldı',
      }[status] ?? status
    );
  }
}
