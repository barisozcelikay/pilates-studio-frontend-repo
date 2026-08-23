import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonDto } from '../lessons/model/lesson-dto';
import { LessonService } from '../lessons/service/lesson-service';
import { ReservationDto, ReservationService } from '../reservations/service/reservation-service';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, RouterLink],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent implements OnInit {
  lesson: LessonDto | null = null;
  reservations: ReservationDto[] = [];
  loading = true;
  processingReservationId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly lessonService: LessonService,
    private readonly reservationService: ReservationService,
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

  markAttended(reservation: ReservationDto): void {
    this.processingReservationId = reservation.id;
    this.reservationService.markAttended(reservation.id).subscribe({
      next: () => this.refresh(),
      error: () => (this.processingReservationId = null),
    });
  }

  cancel(reservation: ReservationDto): void {
    this.processingReservationId = reservation.id;
    this.reservationService.cancel(reservation.id).subscribe({
      next: () => this.refresh(),
      error: () => (this.processingReservationId = null),
    });
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
