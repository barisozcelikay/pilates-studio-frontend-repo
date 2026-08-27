import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { LessonDto } from '../lessons/model/lesson-dto';
import { LessonService } from '../lessons/service/lesson-service';
import { ReservationDto, ReservationService } from '../reservations/service/reservation-service';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { MemberDto } from '../members/model/member-dto';
import { MemberService } from '../members/service/member-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    RouterLink,
    FormsModule,
    Select,
    DrawerComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent implements OnInit {
  lesson: LessonDto | null = null;
  reservations: ReservationDto[] = [];
  loading = true;
  processingReservationId: number | null = null;
  members: MemberDto[] = [];
  selectedMemberId: number | null = null;
  addMemberDrawerVisible = false;
  addingMember = false;
  addMemberError = '';
  actionError = '';
  confirmVisible = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmText = '';
  pendingAction: 'attend' | 'cancel' | 'remove' | 'delete' | null = null;
  pendingReservation: ReservationDto | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly lessonService: LessonService,
    private readonly reservationService: ReservationService,
    private readonly memberService: MemberService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    this.lessonService.findById(lessonId).subscribe({
      next: (lesson) => {
        this.lesson = lesson;
        this.cdr.detectChanges();
      },
    });
    this.loadReservations(lessonId);
  }

  openAddMemberDrawer(): void {
    this.selectedMemberId = null;
    this.addMemberError = '';
    this.addMemberDrawerVisible = true;
    if (!this.members.length) {
      this.memberService.findAll().subscribe({
        next: (members) => (this.members = members.filter((member) => member.status === 'ACTIVE')),
      });
    }
  }

  addMember(): void {
    if (!this.lesson?.id || !this.selectedMemberId) return;
    if (this.reservations.some((reservation) => reservation.memberId === this.selectedMemberId)) {
      this.addMemberError = 'Bu üye zaten derse ekli.';
      return;
    }
    this.addingMember = true;
    this.reservationService.create(this.lesson.id, this.selectedMemberId).subscribe({
      next: () => {
        this.addingMember = false;
        this.addMemberDrawerVisible = false;
        this.refresh();
      },
      error: (error) => {
        this.addingMember = false;
        this.addMemberError = error?.error?.message ?? 'Üye derse eklenemedi.';
      },
    });
  }

  requestAction(reservation: ReservationDto, action: 'attend' | 'cancel' | 'delete'): void {
    this.pendingReservation = reservation;
    this.pendingAction = action;
    this.actionError = '';
    const actionCopy = {
      attend: [
        'Katılımı Onayla',
        'Üyenin ders hakkından 1 kullanım düşülecek. Devam etmek istiyor musunuz?',
        'Katıldı',
      ],
      cancel: [
        'İptal Hakkından Düşür',
        'Üyenin iptal hakkından 1 kullanım düşülecek. Devam etmek istiyor musunuz?',
        'İptal Et',
      ],
      delete: [
        'Rezervasyonu Sil',
        'Rezervasyon kaydı kalıcı olarak silinecek. Daha önce düşülen haklar geri yüklenmez.',
        'Sil',
      ],
    }[action];
    this.confirmTitle = actionCopy[0];
    this.confirmMessage = actionCopy[1];
    this.confirmText = actionCopy[2];
    this.confirmVisible = true;
  }

  confirmAction(): void {
    const reservation = this.pendingReservation;
    const action = this.pendingAction;
    if (!reservation || !action) return;
    this.processingReservationId = reservation.id;
    const request: Observable<unknown> =
      action === 'attend'
        ? this.reservationService.markAttended(reservation.id)
        : action === 'cancel'
          ? this.reservationService.cancel(reservation.id)
          : this.reservationService.delete(reservation.id);
    request.subscribe({
      next: () => {
        if (action === 'delete') {
          this.reservations = this.reservations.filter((item) => item.id !== reservation.id);
        }
        this.processingReservationId = null;
        this.refresh();
      },
      error: (error) => {
        this.processingReservationId = null;
        this.actionError = error?.error?.message ?? 'Rezervasyon işlemi gerçekleştirilemedi.';
        this.cdr.detectChanges();
      },
    });
  }

  statusLabel(status: ReservationDto['status']): string {
    return {
      CONFIRMED: 'Rezerve edildi',
      ATTENDED: 'Katıldı',
      CANCELLED_WITH_RIGHT: 'İptal hakkından düşürüldü',
      REMOVED: 'Dersten çıkarıldı',
    }[status];
  }

  private refresh(): void {
    const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    this.lessonService.findById(lessonId).subscribe({
      next: (lesson) => {
        this.lesson = lesson;
        this.cdr.detectChanges();
      },
    });
    this.loadReservations(lessonId);
  }

  private loadReservations(lessonId: number): void {
    this.reservationService.findAllByLessonId(lessonId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
